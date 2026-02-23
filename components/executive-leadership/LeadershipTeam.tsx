"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function LeadershipTeam() {
  const t = useTranslations("leadership-team");
  const team = [
    {
      name: "Bhaskar Banerjee",
      role: t("bhaskar_banerjee.role"),
      img: "/images/leadership/bhaskar.jpg",
      href: "https://in.linkedin.com/in/bhaskarcma09?trk=public_post-text",
      bio: t("bhaskar_banerjee.bio"),
    },
    {
      name: "Dheeraj Jain",
      role: t("dheeraj_jain.role"),
      img: "/images/leadership/dheeraj.jpg",
      href: "https://in.linkedin.com/in/dheeraj-jain-ab860a2a",
      bio: t("dheeraj_jain.bio"),
    },
    {
      name: "Shivani Jain",
      role: t("shivani_jain.role"),
      img: "/images/leadership/shivani.jpg",
      href: "https://in.linkedin.com/company/avid-organics",
      bio: t("shivani_jain.bio"),
    },
  ];

  return (
    <section className="py-16 container-inner">
      <div className="gap-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {team.map((member, index) => (
          <div key={index} className="text-center">
            <Link href={member.href} target="_blank">
              {/* Square Image */}
              <div className="relative mb-5 w-full aspect-square overflow-hidden">
                <Image src={member.img} alt={member.name} fill className="object-cover" />
              </div>

              <h3 className="mb-1 font-extrabold text-primary text-2xl">{member.name}</h3>

              <p className="mb-4 font-semibold text-medium-dark">{member.role}</p>
              <div className="bg-light-dark mx-auto my-3 w-12 h-px"></div>
              <p className="text-light-dark text-sm leading-relaxed">{member.bio}</p>
            </Link>
          </div>
        ))}
      </div>
    </section>
  );
}
