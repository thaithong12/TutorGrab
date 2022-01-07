package com.thaithong.datn.service;

import com.thaithong.datn.entity.SubjectEntity;
import com.thaithong.datn.model.SubjectResponseModel;
import com.thaithong.datn.repository.SubjectRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.ArrayList;
import java.util.List;

@Service
public class SubjectService {

    @Autowired
    private SubjectRepository subjectRepository;

    public List<SubjectResponseModel> getAllSubjects () {
        var arr = (List<SubjectEntity>)subjectRepository.findAll();
        var arrReturn = new ArrayList<SubjectResponseModel>();
        if (!CollectionUtils.isEmpty(arr)) {
            arr.forEach(item -> {
                arrReturn.add(convertEntityToModel(item));
            });
        }
        return arrReturn;
    }

    public SubjectResponseModel convertEntityToModel (SubjectEntity subjectEntity) {
        var subj = new SubjectResponseModel();
        subj.setId(subjectEntity.getId());
        subj.setCreatedAt(subjectEntity.getCreatedAt());
        subj.setCreatedBy(subjectEntity.getCreatedBy());
        subj.setUpdatedAt(subjectEntity.getUpdatedAt());
        subj.setUpdatedBy(subjectEntity.getUpdatedBy());
        subj.setName(subjectEntity.getName());
        return subj;
    }
}
