// import Image from 'next/image';
// import { teamMembers } from '@/lib/data';
// import { PlaceHolderImages } from '@/lib/placeholder-images';
// import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
// import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
// import { Github, Briefcase, Instagram } from 'lucide-react';
// import { Button } from '../ui/button';
// import { Github, Globe } from 'lucide-react'; // Assuming Globe is used for portfolio


// export default function Team() {
//   const getImageForMember = (memberId: string) => {
//     return PlaceHolderImages.find((img) => img.id === memberId);
//   };

//   return (
//     <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
//       {teamMembers.map((member) => {
//         const image = getImageForMember(member.id);
//         return (
//           <Card key={member.id} className="text-center">
//             <CardHeader>
//               <Avatar className="mx-auto h-24 w-24">
//                 {image && (
//                   <AvatarImage
//                     src={image.imageUrl}
//                     alt={`Portrait of ${member.name}`}
//                     data-ai-hint={image.imageHint}
//                   />
//                 )}
//                 <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
//               </Avatar>
//             </CardHeader>
//             <CardContent>
//               <h3 className="text-xl font-semibold">{member.name}</h3>
//               <p className="text-primary">{member.role}</p>
//             </CardContent>
//             <CardFooter className="justify-center gap-2">
//                <Button variant="outline" size="icon" asChild>
//                  <a href="#" aria-label={`${member.name}'s Github profile`}>
//                   <Github className="h-4 w-4" />
//                  </a>
//                </Button>
//                <Button variant="outline" size="icon" asChild>
//                  <a href="#" aria-label={`${member.name}'s portfolio`}>
//                   <Briefcase className="h-4 w-4" />
//                  </a>
//                </Button>
//             </CardFooter>
//           </Card>
//         );
//       })}
//     </div>
//   );
// }


// Assuming this is src/components/about/team.tsx

import Image from 'next/image';
import { teamMembers } from '@/lib/data'; // Ensure this import is correct
import { PlaceHolderImages } from '@/lib/placeholder-images'; // Ensure this import is correct
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Github, Briefcase } from 'lucide-react'; // Ensure Briefcase is imported
import { Button } from '../ui/button';


export default function Team() {
  const getImageForMember = (memberId: string) => {
    return PlaceHolderImages.find((img) => img.id === memberId);
  };

  return (
    <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {teamMembers.map((member) => {
        const image = getImageForMember(member.id);
        return (
          <Card key={member.id} className="text-center">
            <CardHeader>
              <Avatar className="mx-auto h-24 w-24">
                {image && (
                  <AvatarImage
                    src={image.imageUrl}
                    alt={`Portrait of ${member.name}`}
                    data-ai-hint={image.imageHint}
                  />
                )}
                <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </CardHeader>
            <CardContent>
              <h3 className="text-xl font-semibold">{member.name}</h3>
              <p className="text-primary">{member.role}</p>
            </CardContent>
            <CardFooter className="justify-center gap-2">
              {member.githubUrl && ( // Conditionally render GitHub button
                <Button variant="outline" size="icon" asChild>
                  <a href={member.githubUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s Github profile`}>
                    <Github className="h-4 w-4" />
                  </a>
                </Button>
              )}
              {member.portfolioUrl && ( // Conditionally render Portfolio button
                <Button variant="outline" size="icon" asChild>
                  <a href={member.portfolioUrl} target="_blank" rel="noopener noreferrer" aria-label={`${member.name}'s portfolio`}>
                    <Briefcase className="h-4 w-4" /> {/* Using Briefcase as per your snippet */}
                  </a>
                </Button>
              )}
            </CardFooter>
          </Card>
        );
      })}
    </div>
  );
}