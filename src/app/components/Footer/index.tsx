import React from "react";
import Image from "next/image";
import Link from "next/link";

const Footer: React.FC = () => {
  return (
    <div className="footer-container">
      <div className="footer-column-one">
        <div className="footer-logo-and-brand">
          <Link href={"https://www.opendollar.com"} target="_blank">
            <Image
              src="/od-full-logo-grey.svg"
              alt="open-dollar-logo"
              width={150}
              height={35}
              itemType="svg"
            />
          </Link>
        </div>
        <div className="footer-call-to-action">
          Leverage your liquid staking tokens with the most flexible stablecoin
          protocol
        </div>
      </div>
      <div className="footer-column-two">
        <div className="projects">
          <div className="projects-title">Projects</div>
          <ul className="projects-list">
            <li className="projects-item">
              <Link href={"https://app.dev.opendollar.com/"} target="_blank">
                Try Testnet Beta
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://docs.opendollar.com/"} target="_blank">
                Docs
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://github.com/open-dollar"} target="_blank">
                Github
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://tally.so/r/wa26qX"} target="_blank">
                Partner
              </Link>
            </li>
          </ul>
        </div>
        <div className="resources">
          <div className="resources-title">Resources</div>
          <ul className="projects-list">
            <li className="projects-item">
              <Link
                href={"https://www.opendollar.com/lite-paper"}
                target="_blank"
              >
                Litepaper
              </Link>
            </li>
            <li className="projects-item">
              <Link
                href={
                  "https://mirror.xyz/0x8a81CEeb0a12998616F1aB932cDbc941F0d539E9"
                }
                target="_blank"
              >
                Blog
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://www.opendollar.com/privacy"} target="_blank">
                Privacy Policy
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://www.opendollar.com/terms"} target="_blank">
                Terms of Service
              </Link>
            </li>
          </ul>
        </div>
        <div className="socials">
          <div className="socials-title">Socials</div>
          <ul className="projects-list">
            <li className="projects-item">
              <Link
                href={"https://discord.com/invite/UbTUfuGBrS"}
                target="_blank"
              >
                Discord
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://twitter.com/open_dollar"} target="_blank">
                Twitter
              </Link>
            </li>
            <li className="projects-item">
              <Link href={"https://t.me/open_dollar"} target="_blank">
                Telegram
              </Link>
            </li>
            <li className="projects-item">
              <Link
                href={"https://debank.com/official/Open_Dollar"}
                target="_blank"
              >
                DeBank
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="footer-column-three">
        <div className="launch-app-container">
          <Link
            href={"https://app.opendollar.com/"}
            target="_blank"
            className="launch-app"
          >
            LAUNCH APP
          </Link>
        </div>
        <div className="link-icons">
          <div className="twitter-icon">
            <Link href={"https://twitter.com/open_dollar"} target="_blank">
              <Image
                src={
                  "/x.svg"
                }
                alt="twitter-icon"
                width={35}
                height={35}
              />
            </Link>
          </div>
          <div className="discord">
            <Link
              href={"https://discord.com/invite/UbTUfuGBrS"}
              target="_blank"
            >
              <Image
                src={"/discord.svg"}
                alt="discord-icon"
                width={35}
                height={35}
              />
            </Link>
          </div>
          <div className="github">
            <Link href={"https://github.com/open-dollar"} target="_blank">
              <Image
                src={
                  "/github.svg"
                }
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
