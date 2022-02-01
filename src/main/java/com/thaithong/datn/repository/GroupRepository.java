package com.thaithong.datn.repository;

import com.thaithong.datn.entity.GroupEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface GroupRepository extends CrudRepository<GroupEntity, Long> {
    @Query(value = "SELECT group_tbls.* FROM `group_tbls` " +
            "INNER JOIN user_group " +
            "ON group_tbls.id=user_group.group_id " +
            "WHERE user_group.user_id=?1 " +
            "ORDER BY group_tbls.updated_at DESC ", nativeQuery = true)
    List<GroupEntity> findAllByUserIdOrderByUpdatedAtDesc(Long userId);

    @Query(value = "SELECT g.id FROM group_tbls g WHERE g.url = :url", nativeQuery = true)
    Long findGroupByUrl(@Param(value = "url") String url);

    @Query(value = "SELECT g.url FROM group_tbls g WHERE g.id = :id", nativeQuery = true)
    String getGroupUrlById(@Param(value = "id") Long id);
}
