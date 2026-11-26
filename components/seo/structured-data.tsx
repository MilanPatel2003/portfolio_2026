import { education, hero, projects, skillGroups, workExperience } from "@/data/data";
import { site } from "@/lib/site";

/**
 * Emits schema.org structured data (ProfilePage, Person, WebSite, and project ItemList)
 * for rich Google Search entity recognition.
 */
export function StructuredData() {
  const baseUrl = site.url.href.replace(/\/$/, "");
  const personId = `${baseUrl}/#person`;
  const currentJob = workExperience.find((job) => job.current) ?? workExperience[0];

  const sameAsLinks = Array.from(
    new Set(
      [
        ...hero.socialLinks.map((link) => link.href),
        ...projects.map((project) => project.liveUrl),
        ...projects.map((project) => project.githubUrl),
        ...(site.resumeUrl ? [site.resumeUrl] : []),
      ].filter((href): href is string => {
        if (!href) return false;
        return /^https?:\/\//i.test(href) && href.replace(/\/$/, "") !== baseUrl;
      }),
    ),
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": `${baseUrl}/#website`,
        url: baseUrl,
        name: site.title,
        description: site.description,
        inLanguage: "en-IN",
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${baseUrl}/#profilepage`,
        url: baseUrl,
        name: site.title,
        description: site.description,
        isPartOf: { "@id": `${baseUrl}/#website` },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: hero.name,
        givenName: hero.firstName,
        familyName: hero.lastName,
        alternateName: [site.githubUsername, "Milan Patel Ahmedabad"],
        url: baseUrl,
        image: `${baseUrl}/avatar/milan-avatar-v4.png`,
        email: hero.email,
        telephone: hero.phone,
        jobTitle: hero.position,
        description: hero.summary,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
        worksFor: currentJob
          ? {
              "@type": "Organization",
              name: currentJob.company,
              ...(currentJob.companyUrl ? { url: currentJob.companyUrl } : {}),
            }
          : undefined,
        alumniOf: education.map((edu) => ({
          "@type": "CollegeOrUniversity",
          name: edu.school,
        })),
        knowsAbout: Array.from(
          new Set(skillGroups.flatMap((group) => group.items)),
        ),
        sameAs: sameAsLinks,
      },
      {
        "@type": "ItemList",
        "@id": `${baseUrl}/#projects`,
        name: "Featured Software Projects by Milan Patel",
        itemListElement: projects.map((project, index) => ({
          "@type": "ListItem",
          position: index + 1,
          item: {
            "@type": "SoftwareSourceCode",
            name: project.title,
            description: project.summary,
            author: { "@id": personId },
            url: project.liveUrl || project.githubUrl || `${baseUrl}/#projects`,
            ...(project.githubUrl ? { codeRepository: project.githubUrl } : {}),
            keywords: project.tags.join(", "),
          },
        })),
      },
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c"),
      }}
    />
  );
}
