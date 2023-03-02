import { config } from "@/config";
import { contentBold, contentReg, ui } from "@/services/font";
import Link from "next/link";
import { BsGithub } from "react-icons/bs";

export const Intro = () => {
  return (
    <>
      <article className="intro" data-nopico>
        <hgroup>
          <h1 className={contentBold}>{config.blogTitle}</h1>
          <p className={contentReg}>
            Welcome to demo of hugo’s theme PaperMod.
            <br />
            PaperMod is a simple but fast and responsive theme with useful
            feature-set that enhances UX.
            <br />
            Do give a 🌟 on Github !
            <br />
            PaperMod is based on theme Paper.
          </p>
        </hgroup>
        <ul className="contacts">
          {config.github !== "" && (
            <li>
              <Link
                href={`https://github.com/${config.github}`}
                target="_blank"
                data-nopico
              >
                <BsGithub size={32} />
              </Link>
            </li>
          )}
        </ul>
      </article>
      <style jsx>{`
        .intro {
          display: flex;
          align-items: flex-start;
          flex-direction: column;
          margin: 24px 0 48px 0;
          padding: 24px 0;
        }
        .intro h1 {
          font-size: 34px;
          margin-bottom: 12px;
        }
        .intro p {
          font-size: 16px;
          line-height: 1.5em;
          margin-bottom: 0;
        }
        .intro hgroup {
          margin-bottom: 12px;
        }
        .contacts {
          padding: 0;
        }
        .contacts li {
          list-style: none;
          float: left;
          color: var(--color);
        }
        .contacts li:hover {
          color: var(--primary);
        }
      `}</style>
    </>
  );
};
