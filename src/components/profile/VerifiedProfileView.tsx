import { Briefcase, Globe, MapPin, Pencil, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ProfileReviewValues } from '@/lib/schemas/profile';

interface VerifiedProfileViewProps {
  profile: ProfileReviewValues;
  onEdit: () => void;
  onReplaceResume: () => void;
  canEdit?: boolean;
  replaceLabel?: string;
}

export function VerifiedProfileView({
  profile,
  onEdit,
  onReplaceResume,
  canEdit = true,
  replaceLabel = 'Replace resume',
}: VerifiedProfileViewProps) {
  const location = [profile.preferredCity, profile.preferredCountry]
    .filter(Boolean)
    .join(', ');

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-semibold tracking-tight">
                {profile.name}
              </h2>
              <Badge>Verified</Badge>
            </div>
            <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
              {profile.currentRole ? (
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5" />
                  {profile.currentRole}
                </span>
              ) : null}
              {location ? (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5" />
                  {location}
                </span>
              ) : null}
              {profile.workMode ? (
                <span className="flex items-center gap-1.5">
                  <Globe className="h-3.5 w-3.5" />
                  {profile.workMode}
                </span>
              ) : null}
            </div>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-muted-foreground">
              <Badge variant="outline">
                Targeting: {profile.targetRole || 'Not set'}
              </Badge>
              {profile.employmentType ? (
                <Badge variant="outline">{profile.employmentType}</Badge>
              ) : null}
              {profile.experienceLevel ? (
                <Badge variant="outline">{profile.experienceLevel}</Badge>
              ) : null}
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={onReplaceResume}>
              <RefreshCw />
              {replaceLabel}
            </Button>
            {canEdit ? (
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Pencil />
                Edit
              </Button>
            ) : null}
          </div>
        </CardContent>
      </Card>

      {profile.summary ? (
        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{profile.summary}</p>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {profile.skills.map((skill) => (
            <Badge key={skill} variant="secondary">
              {skill}
            </Badge>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Experience</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {profile.experience.map((exp) => (
            <div key={exp.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="font-medium">
                  {exp.jobTitle} · {exp.company}
                </p>
                <p className="text-xs text-muted-foreground">
                  {exp.startDate} – {exp.endDate ?? 'Present'}
                </p>
              </div>
              {exp.description ? (
                <p className="mt-1 text-sm text-muted-foreground">
                  {exp.description}
                </p>
              ) : null}
              {exp.achievements.length > 0 ? (
                <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
                  {exp.achievements.map((a) => (
                    <li key={a}>{a}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
          {profile.experience.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No experience listed.
            </p>
          ) : null}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Education</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {profile.education.map((edu) => (
            <div key={edu.id}>
              <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                <p className="font-medium">
                  {edu.degree}, {edu.fieldOfStudy}
                </p>
                <p className="text-xs text-muted-foreground">
                  {edu.institution} · {edu.graduationDate}
                </p>
              </div>
            </div>
          ))}
          {profile.education.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No education listed.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {profile.certifications.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Certifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.certifications.map((cert) => (
              <div
                key={cert.id}
                className="flex flex-wrap items-baseline justify-between gap-x-2 text-sm"
              >
                <span className="font-medium">{cert.name}</span>
                <span className="text-xs text-muted-foreground">
                  {cert.issuer} · {cert.date}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
