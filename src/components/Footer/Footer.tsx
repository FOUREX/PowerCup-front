export const Footer = () => {
  return (
    <footer
      className="fixed flex bottom-2 w-full"
      style={{ color: "var(--color-background-secondary)" }}
    >
      <div className="flex mx-auto items-center gap-3 py-1 px-1 rounded-l-md" style={{backdropFilter: "blur(5px)"}}>
        <span>©</span>

        <div className="flex flex-col content-start">
          <span>Потужна платформа для потужних турнірів</span>
          <span>All rights потужно reserved</span>
        </div>
      </div>
    </footer>
  );
};
