import React, { useState, useEffect } from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

const PermissionTree = ({ permissions, assignedPermission, ...props }) => {
  const [checkedKeys, setCheckedKeys] = useState([]);

  useEffect(() => {
    setCheckedKeys(assignedPermission);
  }, [assignedPermission]);

  const groupedPermissions = permissions.reduce((acc, permission) => {
    const group = permission.group;
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(permission);
    return acc;
  }, {});

  const renderTreeNodes = (data) =>
    data.map((node) => {
      const { value, label, children } = node;
      return (
        <TreeNode key={value} title={label} dataRef={node}>
          {children && renderTreeNodes(children)}
        </TreeNode>
      );
    });

  const renderPermissionGroups = () =>
    Object.entries(groupedPermissions).map(([group, permissions]) => (
      <TreeNode key={group} title={permissions[0].groupLabel}>
        {renderTreeNodes(permissions)}
      </TreeNode>
    ));

  const handleCheck = (checkedKeys) => {
    setCheckedKeys(checkedKeys);
    props.selectedPermissions(checkedKeys);
  };

  return (
    <Tree checkable checkedKeys={checkedKeys} onCheck={handleCheck}>
      {renderPermissionGroups()}
    </Tree>
  );
};

export default PermissionTree;
