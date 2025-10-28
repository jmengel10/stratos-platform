import { getAllConversations } from '@/lib/storage';
import ConversationClient from './ConversationClient';

// Generate static paths for sample conversations
export async function generateStaticParams() {
  // Return a few sample IDs for static generation
  return [
    { id: '1' },
    { id: '2' },
    { id: '3' },
  ];
}

// This page needs to be client-rendered for real-time chat
export const dynamicParams = true; // Allow runtime params not in generateStaticParams

// Server component wrapper
export default function ConversationPage({ params }: { params: { id: string } }) {
  return <ConversationClient params={params} />;
}