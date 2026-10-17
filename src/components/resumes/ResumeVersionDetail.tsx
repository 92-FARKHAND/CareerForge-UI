import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { DetailField } from '@/components/shared/DetailField';
import {
  formatDateTime,
  formatUnknownValue,
  humanizeKey,
  isHttpUrl,
} from '@/lib/utils/format';
import type { ResumeVersion } from '@/lib/types/resume';

function LinkOrText({ value }: { value: string }) {
  if (!isHttpUrl(value)) return <>{value}</>;

  return (
    <a
      href={value}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-4"
    >
      {value}
    </a>
  );
}

function TagList({ items }: { items: string[] }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((item) => (
        <Badge key={item} variant="secondary">
          {item}
        </Badge>
      ))}
    </div>
  );
}

/** Every field of one resume version, each under its own title. */
export function ResumeVersionDetail({ version }: { version: ResumeVersion }) {
  const skills = version.skills ?? [];
  const experience = version.experience ?? [];
  const education = version.education ?? [];
  const certifications = version.certifications ?? [];
  const projects = version.projects ?? [];
  const links = version.links;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="Name">{version.name}</DetailField>
            <DetailField label="Extraction status">
              <Badge variant={version.status === 'COMPLETED' ? 'default' : 'outline'}>
                {version.status}
              </Badge>
            </DetailField>
            <DetailField label="Created">{formatDateTime(version.createdAt)}</DetailField>
            <DetailField label="Failure reason">{version.failureReason}</DetailField>
            <DetailField label="Summary" className="sm:col-span-2">
              {version.summary}
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
          <CardDescription>
            {skills.length} extracted {skills.length === 1 ? 'skill' : 'skills'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {skills.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <Badge
                  key={skill.id}
                  variant="secondary"
                  title={
                    skill.proficiencyGuess
                      ? `Estimated proficiency: ${skill.proficiencyGuess}`
                      : undefined
                  }
                >
                  {skill.name}
                  {skill.category ? ` · ${skill.category}` : ''}
                </Badge>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">No skills extracted.</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
          <CardDescription>
            {experience.length} {experience.length === 1 ? 'role' : 'roles'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {experience.length === 0 ? (
            <p className="text-sm text-muted-foreground">No experience extracted.</p>
          ) : null}
          {experience.map((exp, index) => (
            <div key={index} className="rounded-lg border p-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Job title">{exp.jobTitle}</DetailField>
                <DetailField label="Company">{exp.company}</DetailField>
                <DetailField label="Location">{exp.location}</DetailField>
                <DetailField label="Start date">{exp.startDate}</DetailField>
                <DetailField label="End date">{exp.endDate ?? 'Present'}</DetailField>
                <DetailField label="Description" className="sm:col-span-2">
                  {exp.description ? (
                    <span className="whitespace-pre-line">{exp.description}</span>
                  ) : null}
                </DetailField>
                <DetailField label="Achievements" className="sm:col-span-2">
                  {exp.achievements && exp.achievements.length > 0 ? (
                    <ul className="list-disc space-y-1 pl-4">
                      {exp.achievements.map((achievement, i) => (
                        <li key={i}>{achievement}</li>
                      ))}
                    </ul>
                  ) : null}
                </DetailField>
              </dl>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {education.length === 0 ? (
            <p className="text-sm text-muted-foreground">No education extracted.</p>
          ) : null}
          {education.map((edu, index) => (
            <div key={index} className="rounded-lg border p-4">
              <dl className="grid gap-4 sm:grid-cols-2">
                <DetailField label="Degree">{edu.degree}</DetailField>
                <DetailField label="Field of study">{edu.fieldOfStudy}</DetailField>
                <DetailField label="Institution">{edu.institution}</DetailField>
                <DetailField label="Location">{edu.location}</DetailField>
                <DetailField label="Graduation date">{edu.graduationDate}</DetailField>
                <DetailField label="Relevant coursework">
                  {edu.relevantCoursework && edu.relevantCoursework.length > 0 ? (
                    <TagList items={edu.relevantCoursework} />
                  ) : null}
                </DetailField>
              </dl>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Certifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {certifications.length === 0 ? (
            <p className="text-sm text-muted-foreground">No certifications extracted.</p>
          ) : null}
          {certifications.map((cert, index) => (
            <div key={index} className="rounded-lg border p-4">
              <dl className="grid gap-4 sm:grid-cols-3">
                <DetailField label="Name">{cert.name}</DetailField>
                <DetailField label="Issuer">{cert.issuer}</DetailField>
                <DetailField label="Date">{cert.date}</DetailField>
              </dl>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Projects</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {projects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No projects extracted.</p>
          ) : null}
          {projects.map((project, index) => (
            <div key={index} className="rounded-lg border p-4">
              {/* Project fields aren't typed yet (the backend has only
                  returned empty arrays so far), so render whatever keys
                  come back, each under a readable title. */}
              <dl className="grid gap-4 sm:grid-cols-2">
                {Object.entries(project).map(([key, value]) => (
                  <DetailField key={key} label={humanizeKey(key)}>
                    {formatUnknownValue(value)}
                  </DetailField>
                ))}
              </dl>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>
        <CardContent>
          <dl className="grid gap-4 sm:grid-cols-2">
            <DetailField label="GitHub">
              {links?.github ? <LinkOrText value={links.github} /> : null}
            </DetailField>
            <DetailField label="LinkedIn">
              {links?.linkedin ? <LinkOrText value={links.linkedin} /> : null}
            </DetailField>
            <DetailField label="Portfolio">
              {links?.portfolio ? <LinkOrText value={links.portfolio} /> : null}
            </DetailField>
            <DetailField label="Other links">
              {links?.other && links.other.length > 0 ? (
                <ul className="space-y-1">
                  {links.other.map((link) => (
                    <li key={link}>
                      <LinkOrText value={link} />
                    </li>
                  ))}
                </ul>
              ) : null}
            </DetailField>
          </dl>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Extracted text</CardTitle>
          <CardDescription>The raw text read from the uploaded file.</CardDescription>
        </CardHeader>
        <CardContent>
          {version.rawText ? (
            <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-lg bg-muted p-4 text-sm">
              {version.rawText}
            </pre>
          ) : (
            <p className="text-sm text-muted-foreground">No text was extracted.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
