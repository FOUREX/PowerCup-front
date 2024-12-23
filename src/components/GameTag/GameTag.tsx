import {Tag} from "antd";
import type {PresetColorType, PresetStatusColorType} from "antd/es/_util/colors";
import type {LiteralUnion} from "antd/es/_util/type";
import * as React from "react";
import {Game} from "../../api/types.ts";

interface Props {
  game: Game,
  color?: LiteralUnion<PresetColorType | PresetStatusColorType>
}

export const GameTag: React.FC<Props> = ({ game, color = "gray" }) => {
  return (
    <Tag>
      {game.short_name}
    </Tag>
  );
}