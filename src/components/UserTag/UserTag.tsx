import {Tag} from "antd";
import type {PresetColorType, PresetStatusColorType} from "antd/es/_util/colors";
import type {LiteralUnion} from "antd/es/_util/type";
import * as React from "react";
import {Link} from "react-router";
import {User} from "../../api/types.ts";

interface Props {
  user: User,
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>
}

export const UserTag: React.FC<Props> = ({ user, color = "lime" }) => {
  return (
    <Tag color={color}>
      <Link to={`/user?id=${user.id}`}>{user.name}</Link>
    </Tag>
  );
}