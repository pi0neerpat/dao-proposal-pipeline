import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-column-one">
        {/* <div className="footer-logo-and-brand">
          <Link href={"https://"} target="_blank">
            <Image
              src="/full-logo-grey.svg"
              alt="logo"
              width={150}
              height={35}
              itemType="svg"
            />
          </Link>
        </div> */}
        <div className="footer-call-to-action">
          An opinionated set of tools to generate, review, and submit DAO
          proposals.
        </div>
      </div>
      <div className="footer-column-two">
        <div className="projects">
          <div className="projects-title">Projects</div>
          <ul className="projects-list">
            {/* <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Docs
              </Link>
            </li> */}
            <li className="projects-item">
              <Link
                href={"https://github.com/pi0neerpat/dao-proposal-pipeline"}
                target="_blank"
              >
                Github
              </Link>
            </li>
            {/* <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Partner
              </Link>
            </li> */}
          </ul>
        </div>
        {/* <div className="resources">
          <div className="resources-title">Resources</div>
          <ul className="projects-list">
            <li className="projects-item">
              <Link
                href={'https://'}
                target="_blank"
              >
                Litepaper
              </Link>
            </li>
            <li className="projects-item">
              <Link
                href={
                  'https://'
                }
                target="_blank"
              >
                Blog
              </Link>
            </li>
            <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Privacy Policy
              </Link>
            </li>
            <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div> */}
        <div className="socials">
          <div className="socials-title">Socials</div>
          <ul className="projects-list">
            {/* <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Discord
              </Link>
            </li> */}
            <li className="projects-item">
              <Link href={"https://twitter.com/pi0neerpat"} target="_blank">
                Twitter
              </Link>
            </li>
            {/* <li className="projects-item">
              <Link href={'https://t.me/'} target="_blank">
                Telegram
              </Link>
            </li> */}
            {/* <li className="projects-item">
              <Link href={'https://'} target="_blank">
                Farcaster
              </Link>
            </li> */}
            {/* <li className="projects-item">
              <Link
                href={'https://debank.com/official/}
                target="_blank"
              >
                DeBank
              </Link>
            </li> */}
          </ul>
        </div>
      </div>
      <div className="footer-column-three">
        {/* <div className="launch-app-container">
          <Link
            href={'https://'}
            target="_blank"
            className="launch-app"
          >
            LAUNCH APP
          </Link>
        </div> */}
        <div className="link-icons">
          <div className="twitter-icon">
            <Link href={"https://twitter.com/pi0neerpat"} target="_blank">
              <Image src={"/x.svg"} alt="twitter-icon" width={35} height={35} />
            </Link>
          </div>
          {/* <div className="discord">
            <Link
              href={'https://discord.com/invite/'}
              target="_blank"
            >
              <Image
                src={'/discord.svg'}
                alt="discord-icon"
                width={35}
                height={35}
              />
            </Link>
          </div> */}
          <div className="github">
            <Link
              href={"https://github.com/pi0neerpat/dao-proposal-pipeline"}
              target="_blank"
            >
              <Image
                src={"/github.svg"}
                alt="github-icon"
                width={35}
                height={35}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
