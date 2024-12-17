import {Tag} from "antd";
import type {PresetColorType, PresetStatusColorType} from "antd/es/_util/colors";
import type {LiteralUnion} from "antd/es/_util/type";
import * as React from "react";
import {Link} from "react-router";
import {Team} from "../../api/types.ts";

interface Props {
  team: Team,
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>
}

export const TeamTag: React.FC<Props> = ({ team, color = "gold" }) => {
  return (
    <Tag color={color}>
      <Link to={`/teams?team_id=${team.id}`}>{team.name}</Link>
    </Tag>
  );
}