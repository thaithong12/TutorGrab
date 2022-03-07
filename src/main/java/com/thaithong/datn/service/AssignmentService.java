package com.thaithong.datn.service;

import com.thaithong.datn.entity.AssignmentEntity;
import com.thaithong.datn.entity.UserAssignment;
import com.thaithong.datn.enums.PaymentStatus;
import com.thaithong.datn.model.AssignmentRequestModel;
import com.thaithong.datn.model.AssignmentResponseModel;
import com.thaithong.datn.model.ReviewAssignmentRequestModel;
import com.thaithong.datn.model.SubjectResponseModel;
import com.thaithong.datn.repository.*;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import javax.transaction.Transactional;
import java.util.*;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;

@Service
public class AssignmentService {

    @Autowired
    private AssignmentRepository assignmentRepository;

    @Autowired
    private UserAssignmentRepository userAssignmentRepository;

    @Autowired
    private SubjectRepository subjectRepository;

    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private CreditCardRepository cardRepository;

    @Autowired
    private GroupService groupService;

    @Autowired
    private PaymentService paymentService;

    /**
     * @return すべて問題を返却
     */
    public List<AssignmentResponseModel> getAllAssignments() {
        return handleOption(1);
    }

    public AssignmentResponseModel getAssignment(Long id) {
        var ass = assignmentRepository.findByIdAndIsDeleted(id, false);
        throwNotFoundException(id, ass);
        return convertEntityToResponseModel(ass);
    }

    /**
     * @param flag 返事したフラグ
     * @return 返事したフラグとして問題の一覧を返却
     */
    public List<AssignmentResponseModel> getAllAssignmentsWithIsAnsweredAndIsPublished(Boolean flag) {
        if (flag) {
            return handleOption(2);
        } else {
            return handleOption(3);
        }
    }

    public void deleteAssignment(Long id) {
        var ass = assignmentRepository.findByIdAndIsDeleted(id, false);
        throwNotFoundException(id, ass);
//        var listRequest = requestRepository.findByAssignmentId(id);
        var listRequest = requestRepository.findByAssignmentEntity_Id(id);
        if (!CollectionUtils.isEmpty(listRequest)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot Delete this Assignment!"));
        }
        //ass.setIsDeleted(true);
        //assignmentRepository.save(ass);

        assignmentRepository.delete(ass);
    }

    public List<AssignmentResponseModel> getAssignmentByAnsweredIdOrPutterId(Long userId, String who) {
        List<UserAssignment> userAssignments;
        var listReturn = new ArrayList<AssignmentResponseModel>();
        if (who.equals("putter")) {
            userAssignments = userAssignmentRepository.findByRequestId(userId);
        } else {
            userAssignments = userAssignmentRepository.findByResponseId(userId);
        }
        if (!CollectionUtils.isEmpty(userAssignments)) {
            AtomicInteger i = new AtomicInteger(0);
            userAssignments.stream()
                    .map(UserAssignment::getAssignment)
                    .collect(Collectors.toList()).forEach(item -> {
                        var temp = convertEntityToResponseModel(item);
                        temp.setRequestId(userAssignments.get(i.get()).getRequestId());
                        temp.setResponseId(userAssignments.get(i.get()).getResponseId());
                        temp.setRate(userAssignments.get(i.get()).getRate());
                        temp.setReason(userAssignments.get(i.get()).getReason());
                        listReturn.add(temp);

                        i.incrementAndGet();
                    });
        }
        return listReturn;
    }

    private List<AssignmentResponseModel> handleOption(int indicator) {
        switch (indicator) {
            case 1: {
                var asss = assignmentRepository.findByIsDeleted(false);
                var listReturn = new ArrayList<AssignmentResponseModel>();
                if (!CollectionUtils.isEmpty(asss)) {
                    asss.forEach(item -> listReturn.add(convertEntityToResponseModel(item)));
                }
                return listReturn;
            }
            case 2:
//                return assignmentRepository.findByIsAnsweredAndIsPublishedAndIsDeleted(false, false, false);
                return null;
            case 3:
//                return assignmentRepository.findByIsAnsweredAndIsPublishedAndIsDeleted(true, true, false);
                return null;
            default:
                return null;
        }
    }

    public AssignmentResponseModel updateAssignment(Long id, AssignmentRequestModel requestModel) {
        var assignment = assignmentRepository.findByIdAndIsDeleted(id, false);
//        var listRequest = requestRepository.findByAssignmentId(id);
        var listRequest = requestRepository.findByAssignmentEntity_Id(id);
        throwNotFoundException(id, assignment);
        if (assignment.getIsAnswered() || !CollectionUtils.isEmpty(listRequest)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        }
        assignment.setTitle(requestModel.getTitle());
        assignment.setContent(requestModel.getContent());
        assignment.setIsAnswered(requestModel.getIsAnswered());
        assignment.setIsPublished(requestModel.getIsPublished());

        var subject = subjectRepository.findByName(requestModel.getSubject());
        if (Objects.isNull(subject)) {
            //throw new CustomErrorException(HttpStatus.BAD_REQUEST,
            //new ErrorObject("E400001", "Subject is not exist"));
        } else {
            assignment.setSubject(subject);
        }

        var ass = assignmentRepository.save(assignment);
        /*var userAss = new UserAssignment();
        userAss.setAssignment(ass);

        //userAss.setRequestId(ass.getId());
        // TODO
        userAss.setRequestId(1L);*/

        return getAssignment(id);
    }

    private void throwNotFoundException(Long id, AssignmentEntity assignment) {
        if (Objects.isNull(assignment)) {
            throw new CustomErrorException(HttpStatus.NOT_FOUND,
                    new ErrorObject("E404001", "Assignment not found with id = " + id));
        }
    }

    @Transactional(rollbackOn = Exception.class)
    public void createAssignment(AssignmentRequestModel requestModel) {
        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserModel userModel = (UserModel) authentication.getPrincipal();
        if (!Objects.isNull(requestModel)) {
            var ass = new AssignmentEntity();
            ass.setContent(requestModel.getContent());
            ass.setTitle(requestModel.getTitle());
            ass.setDifficultType(requestModel.getDifficultType());
            ass.setIsAnswered(false);
            ass.setIsPublished(false);
            ass.setIsDeleted(false);
            ass.setGrade(requestModel.getGrade());
            ass.setTextContent(requestModel.getTextContent());
            int randomNumber = (int) (Math.random() * (100000 - 10000 + 1) + 10000);
            ass.setAssignmentUrl("ASS" + randomNumber);

            var subject = subjectRepository.findByName(requestModel.getSubject());
            if (ObjectUtils.isEmpty(subject)) {

            } else {
                ass.setSubject(subject);
            }
            var temp = assignmentRepository.save(ass);

            var userAssignment = new UserAssignment();

            userAssignment.setRequestId(requestModel.getUserId());
            userAssignment.setAssignment(temp);
            userAssignment.setIsCompleted(false);
            userAssignment.setIsRejected(false);
            userAssignment.setIsRejected(false);

            userAssignmentRepository.save(userAssignment);
        }
    }

    private AssignmentResponseModel convertEntityToResponseModel(AssignmentEntity assignmentEntity) {
        var ass = new AssignmentResponseModel();
        ass.setId(assignmentEntity.getId());
        ass.setCreatedAt(assignmentEntity.getCreatedAt());
        ass.setCreatedBy(assignmentEntity.getCreatedBy());
        ass.setUpdatedAt(assignmentEntity.getUpdatedAt());
        ass.setUpdatedBy(assignmentEntity.getUpdatedBy());
        ass.setContent(assignmentEntity.getContent());
        ass.setTitle(assignmentEntity.getTitle());
        ass.setDifficultType(assignmentEntity.getDifficultType());
        ass.setIsAnswered(assignmentEntity.getIsAnswered());
        ass.setIsDeleted(assignmentEntity.getIsDeleted());
        ass.setIsPublished(assignmentEntity.getIsPublished());
        ass.setGrade(assignmentEntity.getGrade());
        ass.setTextContent(assignmentEntity.getTextContent());
        ass.setAnswer(assignmentEntity.getAnswer());
        ass.setAssignmentUrl(assignmentEntity.getAssignmentUrl());

        var assRelation = assignmentEntity.getUserAssignments()
                .stream()
                .filter(item -> Objects.equals(item.getAssignment().getId(), ass.getId()))
                .findFirst().orElse(new UserAssignment());
        ass.setRequestId(assRelation.getRequestId());
        ass.setResponseId(assRelation.getResponseId());
        ass.setRate(assRelation.getRate());
        ass.setIsRejected(assRelation.getIsRejected());
        ass.setReason(assRelation.getReason());
        if (!Objects.isNull(assignmentEntity.getSubject())) {
            var subj = new SubjectResponseModel();
            subj.setId(assignmentEntity.getSubject().getId());
            subj.setCreatedAt(assignmentEntity.getSubject().getCreatedAt());
            subj.setCreatedBy(assignmentEntity.getSubject().getCreatedBy());
            subj.setUpdatedAt(assignmentEntity.getSubject().getUpdatedAt());
            subj.setUpdatedBy(assignmentEntity.getSubject().getUpdatedBy());
            subj.setName(assignmentEntity.getSubject().getName());
            subj.setImage(assignmentEntity.getSubject().getImage());
            ass.setSubject(subj);
        }
        return ass;
    }

    public List<AssignmentResponseModel> getAllPublishedAssignment() {
        var data = assignmentRepository.findByIsAnsweredAndIsPublishedAndIsDeleted(true, true, false);
        var listReturn = new ArrayList<AssignmentResponseModel>();
        if (!CollectionUtils.isEmpty(data)) {
            data.forEach(item -> listReturn.add(convertEntityToResponseModel(item)));
        }
        return listReturn;
    }

    public List<AssignmentResponseModel> getAllTodoAssignment() {
        var toAss = assignmentRepository.findAllTodoAssignment();
        var listReturn = new ArrayList<AssignmentResponseModel>();
        if (!CollectionUtils.isEmpty(toAss)) {
            toAss.forEach(item -> listReturn.add(convertEntityToResponseModel(item)));
        }
        return listReturn;
    }

    @Transactional(rollbackOn = {Exception.class, CustomErrorException.class})
    public AssignmentResponseModel updateAnswerAssignment(Long id, AssignmentRequestModel requestModel) {
        var assEntity = assignmentRepository.findById(id);
        if (assEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        }
        var obj = assEntity.get();
        obj.setIsAnswered(true);
        obj.setAnswer(requestModel.getAnswer());

        obj = assignmentRepository.save(obj);

        // new thread
        TimerTask task = new TimerTask() {
            @Transactional(rollbackOn = {Exception.class, CustomErrorException.class})
            public void run() {
                var assEntity = assignmentRepository.findById(id);
                var payment = paymentService.findByAssignmentId(id).get(0);
                boolean check =
                        assEntity.get().getIsAnswered()
                                && payment.getStatus().equals(PaymentStatus.PROCESSING);
                var cardAdmin = userService.findByEmail("102170302@sv2.dut.edu.vn").getCreditCardEntity();
                if (check) {
                    // process payment status
                    payment.setStatus(PaymentStatus.DONE);
                    paymentService.savePayment(payment);

                    // process card admin
                    cardAdmin.setBalance(cardAdmin.getBalance() - assEntity.get().getPrice());
                    cardRepository.save(cardAdmin);

                    // update user assignment
                    var userAss = userAssignmentRepository.findByAssignmentId(id);
                    userAss.setIsCompleted(true);
                    userAssignmentRepository.save(userAss);

                    // process money for recepient
                    var recipient = userService.findById(userAss.getResponseId());
                    var recipientCard = recipient.getCreditCardEntity();
                    recipientCard.setBalance(recipientCard.getBalance() + assEntity.get().getPrice());
                    cardRepository.save(recipientCard);
                }
            }
        };
        Timer timer = new Timer("Timer");
        long delay = 86400000L;
        timer.schedule(task, delay);

        return convertEntityToResponseModel(obj);
    }

    public AssignmentEntity findEntityById(Long id) {
        var assEntity = assignmentRepository.findById(id);
        if (assEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        }
        return assEntity.get();
    }

    @Transactional(rollbackOn = {Exception.class, CustomErrorException.class})
    public Object updateReviewAssignment(Long id, ReviewAssignmentRequestModel requestModel) {
        var assEntity = assignmentRepository.findById(id);
        if (assEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        }
        var obj = assEntity.get();
        var userAss = obj.getUserAssignments();
        var objUserAss = userAss.stream().filter(item -> item.getResponseId() == requestModel.getResponseId()).findFirst().orElse(null);
        var cardAdmin = userService.findByEmail("102170302@sv2.dut.edu.vn").getCreditCardEntity();
        var payment = paymentService.findByAssignmentId(id).get(0);
        if (ObjectUtils.isEmpty(cardAdmin)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Admin Card cannot get !!!"));
        }
        if (Objects.isNull(objUserAss)) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        } else {
            if (requestModel.getIsAccepted()) {
                objUserAss.setIsCompleted(true);
                objUserAss.setRate(requestModel.getRate());

                // process money
                var recipient = userService.findById(requestModel.getResponseId());
                var recipientCard = recipient.getCreditCardEntity();
                recipientCard.setBalance(recipientCard.getBalance() + assEntity.get().getPrice());

                cardRepository.save(recipientCard);
            } else {
                var requestEntity = requestRepository
                        .findByAssignmentEntity_IdAndResponseId(assEntity.get().getId(), requestModel.getResponseId());
                if (getDateDiff(requestEntity.getUpdatedAt(), new Date(), TimeUnit.MINUTES) < 30) {
                    throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                            new ErrorObject("E400001", "Cannot reject now!!!!"));
                }
                objUserAss.setIsRejected(true);
                objUserAss.setReason(requestModel.getReason());

                // process money
                var depositor = userService.findById(requestModel.getRequestId());
                var depositorCard = depositor.getCreditCardEntity();
                depositorCard.setBalance(depositorCard.getBalance() + assEntity.get().getPrice());

                cardRepository.save(depositorCard);
            }
            // process money admin
            cardAdmin.setBalance(cardAdmin.getBalance() - assEntity.get().getPrice());
            cardRepository.save(cardAdmin);

            // update payment status
            payment.setStatus(PaymentStatus.DONE);
            paymentService.savePayment(payment);
        }

        // close chat group
        var groupEntity = assEntity.get().getGroupEntity();
        groupEntity.setIsClosed(true);
        groupService.saveGroup(groupEntity);

        userAssignmentRepository.save(objUserAss);
        return getAssignment(id);
    }

    public static long getDateDiff(Date date1, Date date2, TimeUnit timeUnit) {
        long diffInMillis = date2.getTime() - date1.getTime();
        return timeUnit.convert(diffInMillis, TimeUnit.MINUTES);
    }

    public Object updatePublishedAssignment(Long id, AssignmentRequestModel requestModel) {
        var assEntity = assignmentRepository.findById(id);
        if (assEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        }
        assEntity.get().setIsPublished(requestModel.getIsPublished());

        return convertEntityToResponseModel(assignmentRepository.save(assEntity.get()));
    }
}
