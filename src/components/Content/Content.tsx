import * as React from "react";

type Props = {
  children: React.ReactNode
}

export const Content: React.FC<Props> = ({children}) => {
  return (
    <div
      className="content flex box-border gap-3"
      style={{
        margin: "0 auto",
        paddingTop: "68px",
        maxWidth: "1200px",
      }}
    >
      {children}
    </div>
  )
}