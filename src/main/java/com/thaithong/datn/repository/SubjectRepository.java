package com.thaithong.datn.repository;

import com.thaithong.datn.entity.SubjectEntity;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepository extends CrudRepository<SubjectEntity, Long> {
}
