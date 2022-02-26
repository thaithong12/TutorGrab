package com.thaithong.datn.service;

import com.thaithong.datn.entity.NotificationEntity;
import com.thaithong.datn.model.NotificationRequestModel;
import com.thaithong.datn.model.NotificationResponseModel;
import com.thaithong.datn.repository.NotificationRepository;
import com.thaithong.datn.utils.CustomErrorException;
import com.thaithong.datn.utils.ErrorObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    @Autowired
    private NotificationRepository notificationRepository;

    public List<NotificationResponseModel> getAllNotificationOfUser (long userId) {
        var dataList = notificationRepository.findByReceiverId(userId);
        var dataReturn = new ArrayList<NotificationResponseModel>();
        for (var obj : dataList) {
            dataReturn.add(convertEntityToModel(obj));
        }
        return dataReturn;
    }

    public NotificationResponseModel updateNotification (Long id) {
        var notifyEntity = notificationRepository.findById(id);
        if (notifyEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        } else {
            notifyEntity.get().setIsRead(true);
            return convertEntityToModel(notificationRepository.save(notifyEntity.get()));
        }
    }

    public NotificationResponseModel convertEntityToModel (NotificationEntity entity) {
        var obj = new NotificationResponseModel();
        obj.setNotificationId(entity.getId());
        obj.setSenderId(entity.getSenderId());
        obj.setSenderName(entity.getSenderName());
        obj.setMessage(entity.getContent());
        //obj.setType(entity.getSenderId());
        obj.setMessageSeen(entity.getIsRead());

        if (!ObjectUtils.isEmpty(entity.getRequestEntity())) {
            obj.setRequestId(entity.getRequestEntity().getId());
        }


        return obj;
    }

    public NotificationResponseModel saveNotify (NotificationEntity entity) {
        return convertEntityToModel(notificationRepository.save(entity));
    }

    public List<NotificationResponseModel> updateNotificationList(NotificationRequestModel listRequestModel) {
        var dataReturn = new ArrayList<NotificationResponseModel>();
        if (!CollectionUtils.isEmpty(listRequestModel.getNotifications())) {
            var listTemp = new ArrayList<NotificationEntity>();
            listRequestModel.getNotifications().forEach(item -> {
                var obj = getNotification(item.getNotificationId());
                if (!ObjectUtils.isEmpty(obj)) {
                    obj.setIsRead(true);
                    listTemp.add(obj);
                }
            });
            if (!listTemp.isEmpty()) {
                var entities = (List<NotificationEntity>) notificationRepository.saveAll(listTemp);
                dataReturn = (ArrayList<NotificationResponseModel>)
                        entities.stream().map(item -> convertEntityToModel(item)).collect(Collectors.toList());
            }
        }
        return dataReturn;
    }

    public NotificationEntity getNotification (long id) {
        var notifyEntity = notificationRepository.findById(id);
        if (notifyEntity.isEmpty()) {
            throw new CustomErrorException(HttpStatus.BAD_REQUEST,
                    new ErrorObject("E400001", "Cannot update this assignment!"));
        } else {
           return notifyEntity.get();
        }
    }
}
