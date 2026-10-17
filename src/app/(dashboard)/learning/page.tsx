import Link from 'next/link';
import { Binary, Layers } from 'lucide-react';

import { PageHeader } from '@/components/shared/PageHeader';
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const tracks = [
  {
    title: 'Object-Oriented Programming',
    href: '/learning/oop',
    icon: Layers,
    description:
      'Work through classes, interfaces, and design patterns with short modules built around real examples.',
  },
  {
    title: 'Data Structures & Algorithms',
    href: '/learning/dsa',
    icon: Binary,
    description:
      'Practice arrays, trees, and graphs with problems that adjust to what you got wrong last time.',
  },
];

export default function LearningPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Learning"
        description="Pick a track to work through short modules built around real examples."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {tracks.map((track) => (
          <Link key={track.href} href={track.href}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardHeader>
                <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
                  <track.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <CardTitle>{track.title}</CardTitle>
                <CardDescription>{track.description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
