import { getAgentById, incrementAgentUsage } from './admin-storage';

export interface AIMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIStreamChunk {
  type: 'content' | 'error' | 'done';
  content?: string;
  error?: string;
}

const AZURE_ENDPOINT = 'https://ai-core-openai-5605.openai.azure.com';
const AZURE_API_KEY = '5d5457b21334471f8e6111543aea757e';
const AZURE_API_VERSION = '2024-02-15-preview';
const AZURE_DEPLOYMENT = 'gpt-4';

export async function sendMessageToAI(
  agentId: string,
  messages: AIMessage[],
  onStream?: (chunk: AIStreamChunk) => void
): Promise<string> {
  const agent = getAgentById(agentId);
  
  if (!agent) {
    throw new Error('Agent not found');
  }

  if (!agent.isActive) {
    throw new Error('This agent is currently inactive');
  }

  // Increment usage count
  incrementAgentUsage(agentId);

  // Build messages array with system prompt
  const apiMessages = [
    { role: 'system' as const, content: agent.systemPrompt },
    ...messages
  ];

  const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY
      },
      body: JSON.stringify({
        messages: apiMessages,
        temperature: agent.temperature,
        max_tokens: agent.maxTokens,
        stream: !!onStream
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || `API request failed with status ${response.status}`);
    }

    // Handle streaming response
    if (onStream && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';

      try {
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            onStream({ type: 'done' });
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              
              if (data === '[DONE]') {
                continue;
              }

              try {
                const parsed = JSON.parse(data);
                const content = parsed.choices?.[0]?.delta?.content;
                
                if (content) {
                  fullContent += content;
                  onStream({ type: 'content', content });
                }
              } catch (e) {
                // Skip invalid JSON
                console.warn('Failed to parse streaming chunk:', e);
              }
            }
          }
        }
      } catch (streamError) {
        console.error('Streaming error:', streamError);
        throw streamError;
      }

      return fullContent;
    }

    // Handle non-streaming response
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    return content;

  } catch (error) {
    console.error('Azure AI Service Error:', error);
    
    if (onStream) {
      onStream({ 
        type: 'error', 
        error: error instanceof Error ? error.message : 'Failed to get AI response' 
      });
    }
    
    throw error;
  }
}

// Test connection function for admin
export async function testAzureConnection(): Promise<{ success: boolean; message: string }> {
  try {
    const url = `${AZURE_ENDPOINT}/openai/deployments/${AZURE_DEPLOYMENT}/chat/completions?api-version=${AZURE_API_VERSION}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': AZURE_API_KEY
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: 'Test connection' }],
        max_tokens: 10
      })
    });

    if (response.ok) {
      return { success: true, message: 'Azure OpenAI connection successful!' };
    } else {
      const error = await response.json();
      return { success: false, message: error.error?.message || 'Connection failed' };
    }
  } catch (error) {
    return { 
      success: false, 
      message: error instanceof Error ? error.message : 'Connection test failed' 
    };
  }
}

