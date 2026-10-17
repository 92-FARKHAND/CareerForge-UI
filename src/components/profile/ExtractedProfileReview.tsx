'use client';

import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Trash2 } from 'lucide-react';

import { TagListInput } from '@/components/shared/TagListInput';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

import {
  profileReviewSchema,
  type ProfileReviewValues,
} from '@/lib/schemas/profile';

function newId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.round(Math.random() * 1e6)}`;
}

interface ExtractedProfileReviewProps {
  initialValues: ProfileReviewValues;
  onConfirm: (values: ProfileReviewValues) => void;
  isSubmitting?: boolean;
}

// ============================================================================
// Select options
// ============================================================================

const experienceLevelOptions = [
  {
    value: 'STUDENT',
    label: 'Student',
  },
  {
    value: 'ENTRY_LEVEL',
    label: 'Entry level',
  },
  {
    value: 'JUNIOR',
    label: 'Junior',
  },
  {
    value: 'MID_LEVEL',
    label: 'Mid level',
  },
  {
    value: 'SENIOR',
    label: 'Senior',
  },
  {
    value: 'LEAD',
    label: 'Lead',
  },
];

const workModeOptions = [
  {
    value: 'REMOTE',
    label: 'Remote',
  },
  {
    value: 'ONSITE',
    label: 'On-site',
  },
  {
    value: 'HYBRID',
    label: 'Hybrid',
  },
];

const employmentTypeOptions = [
  {
    value: 'FULL_TIME',
    label: 'Full time',
  },
  {
    value: 'PART_TIME',
    label: 'Part time',
  },
  {
    value: 'CONTRACT',
    label: 'Contract',
  },
  {
    value: 'INTERNSHIP',
    label: 'Internship',
  },
];

// ============================================================================
// Shared error component
// ============================================================================

function FieldError({
  message,
}: {
  message?: string;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className="text-sm text-destructive" role="alert">
      {message}
    </p>
  );
}

// ============================================================================
// Component
// ============================================================================

export function ExtractedProfileReview({
  initialValues,
  onConfirm,
  isSubmitting = false,
}: ExtractedProfileReviewProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ProfileReviewValues>({
    resolver: zodResolver(profileReviewSchema),
    defaultValues: initialValues,
    mode: 'onBlur',
  });

  const experienceArray = useFieldArray({
    control,
    name: 'experience',
  });

  const educationArray = useFieldArray({
    control,
    name: 'education',
  });

  const certificationArray = useFieldArray({
    control,
    name: 'certifications',
  });

  return (
    <form
      onSubmit={handleSubmit(onConfirm)}
      className="space-y-6"
      noValidate
    >
      {/* ================================================================== */}
      {/* Profile basics */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Profile basics</CardTitle>

          <CardDescription>
            Pulled from your resume — fix anything that looks off and fill in
            what&apos;s missing.
          </CardDescription>
        </CardHeader>

        <CardContent className="grid gap-4 sm:grid-cols-2">
          {/* Name */}
          <div className="space-y-2">
            <Label htmlFor="name">Full name</Label>

            <Input
              id="name"
              aria-invalid={!!errors.name}
              {...register('name')}
            />

            <FieldError message={errors.name?.message} />
          </div>

          {/* Current role */}
          <div className="space-y-2">
            <Label htmlFor="currentRole">Current role</Label>

            <Input
              id="currentRole"
              aria-invalid={!!errors.currentRole}
              {...register('currentRole')}
            />

            <FieldError message={errors.currentRole?.message} />
          </div>

          {/* Years of experience */}
          <div className="space-y-2">
            <Label htmlFor="yearsOfExperience">
              Years of experience
            </Label>

            <Input
              id="yearsOfExperience"
              type="number"
              min={0}
              aria-invalid={!!errors.yearsOfExperience}
              {...register('yearsOfExperience', {
                valueAsNumber: true,
              })}
            />

            <FieldError
              message={errors.yearsOfExperience?.message}
            />
          </div>

          {/* Experience level */}
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">
              Experience level
            </Label>

            <Controller
              control={control}
              name="experienceLevel"
              render={({ field }) => (
                <select
                  id="experienceLevel"
                  ref={field.ref}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.experienceLevel}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    Select experience level
                  </option>

                  {experienceLevelOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />

            <FieldError
              message={errors.experienceLevel?.message}
            />
          </div>

          {/* Target role */}
          <div className="space-y-2">
            <Label htmlFor="targetRole">Target role</Label>

            <Input
              id="targetRole"
              aria-invalid={!!errors.targetRole}
              {...register('targetRole')}
            />

            <FieldError message={errors.targetRole?.message} />
          </div>

          {/* Work mode */}
          <div className="space-y-2">
            <Label htmlFor="workMode">Work mode</Label>

            <Controller
              control={control}
              name="workMode"
              render={({ field }) => (
                <select
                  id="workMode"
                  ref={field.ref}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.workMode}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select work mode</option>

                  {workModeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />

            <FieldError message={errors.workMode?.message} />
          </div>

          {/* Employment type */}
          <div className="space-y-2">
            <Label htmlFor="employmentType">
              Employment type
            </Label>

            <Controller
              control={control}
              name="employmentType"
              render={({ field }) => (
                <select
                  id="employmentType"
                  ref={field.ref}
                  value={field.value ?? ''}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  aria-invalid={!!errors.employmentType}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">
                    Select employment type
                  </option>

                  {employmentTypeOptions.map((option) => (
                    <option
                      key={option.value}
                      value={option.value}
                    >
                      {option.label}
                    </option>
                  ))}
                </select>
              )}
            />

            <FieldError
              message={errors.employmentType?.message}
            />
          </div>

          {/* Preferred country */}
          <div className="space-y-2">
            <Label htmlFor="preferredCountry">
              Preferred country
            </Label>

            <Input
              id="preferredCountry"
              aria-invalid={!!errors.preferredCountry}
              {...register('preferredCountry')}
            />

            <FieldError
              message={errors.preferredCountry?.message}
            />
          </div>

          {/* Preferred city */}
          <div className="space-y-2">
            <Label htmlFor="preferredCity">
              Preferred city
            </Label>

            <Input
              id="preferredCity"
              aria-invalid={!!errors.preferredCity}
              {...register('preferredCity')}
            />

            <FieldError
              message={errors.preferredCity?.message}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Summary */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>

        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="summary">Professional summary</Label>

            <Textarea
              id="summary"
              rows={4}
              maxLength={1000}
              aria-invalid={!!errors.summary}
              {...register('summary')}
            />

            <FieldError message={errors.summary?.message} />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Skills */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>

          <CardDescription>
            Add anything the extraction missed.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <Controller
            control={control}
            name="skills"
            render={({ field }) => (
              <TagListInput
                value={field.value}
                onChange={field.onChange}
                placeholder="Add a skill and press Enter"
                error={errors.skills?.message}
              />
            )}
          />
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Experience */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <div>
              <CardTitle>Experience</CardTitle>

              <CardDescription>
                Most recent role first.
              </CardDescription>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                experienceArray.append({
                  id: newId('exp'),
                  company: '',
                  jobTitle: '',
                  location: '',
                  startDate: '',
                  endDate: null,
                  description: '',
                  achievements: [],
                })
              }
            >
              <Plus />
              Add role
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {experienceArray.fields.map((field, index) => {
            const experienceErrors = errors.experience?.[index];

            return (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    {/* Job title */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`experience.${index}.jobTitle`}
                      >
                        Job title
                      </Label>

                      <Input
                        id={`experience.${index}.jobTitle`}
                        aria-invalid={
                          !!experienceErrors?.jobTitle
                        }
                        {...register(
                          `experience.${index}.jobTitle`,
                        )}
                      />

                      <FieldError
                        message={
                          experienceErrors?.jobTitle?.message
                        }
                      />
                    </div>

                    {/* Company */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`experience.${index}.company`}
                      >
                        Company
                      </Label>

                      <Input
                        id={`experience.${index}.company`}
                        aria-invalid={
                          !!experienceErrors?.company
                        }
                        {...register(
                          `experience.${index}.company`,
                        )}
                      />

                      <FieldError
                        message={
                          experienceErrors?.company?.message
                        }
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`experience.${index}.location`}
                      >
                        Location
                      </Label>

                      <Input
                        id={`experience.${index}.location`}
                        aria-invalid={
                          !!experienceErrors?.location
                        }
                        {...register(
                          `experience.${index}.location`,
                        )}
                      />

                      <FieldError
                        message={
                          experienceErrors?.location?.message
                        }
                      />
                    </div>

                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-2">
                        <Label
                          htmlFor={`experience.${index}.startDate`}
                        >
                          Start date
                        </Label>

                        <Input
                          id={`experience.${index}.startDate`}
                          placeholder="YYYY-MM"
                          aria-invalid={
                            !!experienceErrors?.startDate
                          }
                          {...register(
                            `experience.${index}.startDate`,
                          )}
                        />

                        <FieldError
                          message={
                            experienceErrors?.startDate?.message
                          }
                        />
                      </div>

                      <div className="space-y-2">
                        <Label
                          htmlFor={`experience.${index}.endDate`}
                        >
                          End date
                        </Label>

                        <Input
                          id={`experience.${index}.endDate`}
                          placeholder="YYYY-MM, blank if current"
                          aria-invalid={
                            !!experienceErrors?.endDate
                          }
                          {...register(
                            `experience.${index}.endDate`,
                          )}
                        />

                        <FieldError
                          message={
                            experienceErrors?.endDate?.message
                          }
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      experienceArray.remove(index)
                    }
                    aria-label="Remove this role"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Description */}
                <div className="space-y-2">
                  <Label
                    htmlFor={`experience.${index}.description`}
                  >
                    Description
                  </Label>

                  <Textarea
                    id={`experience.${index}.description`}
                    rows={2}
                    aria-invalid={
                      !!experienceErrors?.description
                    }
                    {...register(
                      `experience.${index}.description`,
                    )}
                  />

                  <FieldError
                    message={
                      experienceErrors?.description?.message
                    }
                  />
                </div>

                {/* Achievements */}
                <div className="space-y-2">
                  <Label>Achievements</Label>

                  <Controller
                    control={control}
                    name={`experience.${index}.achievements`}
                    render={({ field }) => (
                      <TagListInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add an achievement and press Enter"
                        error={
                          experienceErrors?.achievements?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            );
          })}

          {experienceArray.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No work experience added yet.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Education */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Education</CardTitle>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                educationArray.append({
                  id: newId('edu'),
                  degree: '',
                  location: '',
                  institution: '',
                  fieldOfStudy: '',
                  graduationDate: '',
                  relevantCoursework: [],
                })
              }
            >
              <Plus />
              Add education
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {educationArray.fields.map((field, index) => {
            const educationErrors = errors.education?.[index];

            return (
              <div
                key={field.id}
                className="space-y-3 rounded-lg border p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="grid flex-1 gap-3 sm:grid-cols-2">
                    {/* Institution */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.institution`}
                      >
                        Institution
                      </Label>

                      <Input
                        id={`education.${index}.institution`}
                        aria-invalid={
                          !!educationErrors?.institution
                        }
                        {...register(
                          `education.${index}.institution`,
                        )}
                      />

                      <FieldError
                        message={
                          educationErrors?.institution?.message
                        }
                      />
                    </div>

                    {/* Degree */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.degree`}
                      >
                        Degree
                      </Label>

                      <Input
                        id={`education.${index}.degree`}
                        aria-invalid={
                          !!educationErrors?.degree
                        }
                        {...register(
                          `education.${index}.degree`,
                        )}
                      />

                      <FieldError
                        message={
                          educationErrors?.degree?.message
                        }
                      />
                    </div>

                    {/* Field of study */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.fieldOfStudy`}
                      >
                        Field of study
                      </Label>

                      <Input
                        id={`education.${index}.fieldOfStudy`}
                        aria-invalid={
                          !!educationErrors?.fieldOfStudy
                        }
                        {...register(
                          `education.${index}.fieldOfStudy`,
                        )}
                      />

                      <FieldError
                        message={
                          educationErrors?.fieldOfStudy?.message
                        }
                      />
                    </div>

                    {/* Graduation date */}
                    <div className="space-y-2">
                      <Label
                        htmlFor={`education.${index}.graduationDate`}
                      >
                        Graduation date
                      </Label>

                      <Input
                        id={`education.${index}.graduationDate`}
                        placeholder="YYYY-MM"
                        aria-invalid={
                          !!educationErrors?.graduationDate
                        }
                        {...register(
                          `education.${index}.graduationDate`,
                        )}
                      />

                      <FieldError
                        message={
                          educationErrors?.graduationDate?.message
                        }
                      />
                    </div>

                    {/* Location */}
                    <div className="space-y-2 sm:col-span-2">
                      <Label
                        htmlFor={`education.${index}.location`}
                      >
                        Location
                      </Label>

                      <Input
                        id={`education.${index}.location`}
                        aria-invalid={
                          !!educationErrors?.location
                        }
                        {...register(
                          `education.${index}.location`,
                        )}
                      />

                      <FieldError
                        message={
                          educationErrors?.location?.message
                        }
                      />
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      educationArray.remove(index)
                    }
                    aria-label="Remove this education entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Relevant coursework */}
                <div className="space-y-2">
                  <Label>Relevant coursework</Label>

                  <Controller
                    control={control}
                    name={`education.${index}.relevantCoursework`}
                    render={({ field }) => (
                      <TagListInput
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Add a course and press Enter"
                        error={
                          educationErrors?.relevantCoursework?.message
                        }
                      />
                    )}
                  />
                </div>
              </div>
            );
          })}

          {educationArray.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No education added yet.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Certifications */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-2">
            <CardTitle>Certifications</CardTitle>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() =>
                certificationArray.append({
                  id: newId('cert'),
                  name: '',
                  issuer: '',
                  date: '',
                })
              }
            >
              <Plus />
              Add certification
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {certificationArray.fields.map((field, index) => {
            const certificationErrors =
              errors.certifications?.[index];

            return (
              <div
                key={field.id}
                className="flex items-start gap-2 rounded-lg border p-4"
              >
                <div className="grid flex-1 gap-3 sm:grid-cols-3">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`certifications.${index}.name`}
                    >
                      Name
                    </Label>

                    <Input
                      id={`certifications.${index}.name`}
                      aria-invalid={
                        !!certificationErrors?.name
                      }
                      {...register(
                        `certifications.${index}.name`,
                      )}
                    />

                    <FieldError
                      message={
                        certificationErrors?.name?.message
                      }
                    />
                  </div>

                  {/* Issuer */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`certifications.${index}.issuer`}
                    >
                      Issuer
                    </Label>

                    <Input
                      id={`certifications.${index}.issuer`}
                      aria-invalid={
                        !!certificationErrors?.issuer
                      }
                      {...register(
                        `certifications.${index}.issuer`,
                      )}
                    />

                    <FieldError
                      message={
                        certificationErrors?.issuer?.message
                      }
                    />
                  </div>

                  {/* Date */}
                  <div className="space-y-2">
                    <Label
                      htmlFor={`certifications.${index}.date`}
                    >
                      Date
                    </Label>

                    <Input
                      id={`certifications.${index}.date`}
                      placeholder="YYYY"
                      aria-invalid={
                        !!certificationErrors?.date
                      }
                      {...register(
                        `certifications.${index}.date`,
                      )}
                    />

                    <FieldError
                      message={
                        certificationErrors?.date?.message
                      }
                    />
                  </div>
                </div>

                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    certificationArray.remove(index)
                  }
                  aria-label="Remove this certification"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            );
          })}

          {certificationArray.fields.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No certifications added yet.
            </p>
          ) : null}
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Links */}
      {/* ================================================================== */}

      <Card>
        <CardHeader>
          <CardTitle>Links</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            {/* GitHub */}
            <div className="space-y-2">
              <Label htmlFor="links.github">GitHub</Label>

              <Input
                id="links.github"
                aria-invalid={!!errors.links?.github}
                {...register('links.github')}
              />

              <FieldError
                message={errors.links?.github?.message}
              />
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="links.linkedin">LinkedIn</Label>

              <Input
                id="links.linkedin"
                aria-invalid={!!errors.links?.linkedin}
                {...register('links.linkedin')}
              />

              <FieldError
                message={errors.links?.linkedin?.message}
              />
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <Label htmlFor="links.portfolio">Portfolio</Label>

              <Input
                id="links.portfolio"
                aria-invalid={!!errors.links?.portfolio}
                {...register('links.portfolio')}
              />

              <FieldError
                message={errors.links?.portfolio?.message}
              />
            </div>
          </div>

          {/* Other links */}
          <div className="space-y-2">
            <Label>Other links</Label>

            <Controller
              control={control}
              name="links.other"
              render={({ field }) => (
                <TagListInput
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="Add a link and press Enter"
                  error={errors.links?.other?.message}
                />
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* ================================================================== */}
      {/* Submit */}
      {/* ================================================================== */}

      <div className="flex justify-end gap-2">
        <Button
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Saving…' : 'Confirm profile'}
        </Button>
      </div>
    </form>
  );
}