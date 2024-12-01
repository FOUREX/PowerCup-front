export const Footer = () => {
  return (
    <footer
      className="fixed flex bottom-5 w-full"
      style={{ color: "var(--color-background-secondary)" }}
    >
      <div className="flex mx-auto items-center gap-3">
        <span>©</span>

        <div className="flex flex-col content-start">
          <span>Потужна платформа для потужних турнірів</span>
          <span>All rights потужно reserved</span>
        </div>
      </div>
    </footer>
  );
};
