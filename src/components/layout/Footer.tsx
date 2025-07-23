export function Footer() {
  return (
    <footer className="my-4 flex flex-row justify-center space-x-4 divide-x-2 divide-black">
      <p className="pr-4">
        Made by{' '}
        <a
          href="https://dertimonius.dev"
          target="_blank"
          rel="noreferrer"
          className="cursor-pointer hover:text-cyan-main hover:underline"
        >
          DerTimonius
        </a>
      </p>
      <p>
        Found some issues? Report them{' '}
        <a
          href="https://github.com/DerTimonius/scorey/issues/new"
          className="cursor-pointer hover:text-cyan-main hover:underline"
        >
          here
        </a>
      </p>
    </footer>
  );
}
