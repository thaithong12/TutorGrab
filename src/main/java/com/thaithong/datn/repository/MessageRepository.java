package com.thaithong.datn.repository;

import com.thaithong.datn.entity.MessageEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends CrudRepository<MessageEntity, Long> {
    @Query(value = "SELECT * FROM (SELECT * FROM message m WHERE m.group_id=:id and ((:offset > 0 and m.id < :offset) or (:offset <= 0)) ORDER BY m.id DESC LIMIT 20)t order by id", nativeQuery = true)
    List<MessageEntity> findByGroupIdAndOffset(@Param(value = "id") int id, @Param(value = "offset") int offset);
}
