import { request } from './client';
import { UpvoteResponse } from './types';

export const upvoteTool = async (toolId: string): Promise<UpvoteResponse> => {
  // Call the API endpoint to upvote the tool
  return request(`/tools/upvote/${toolId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    }
  });
};
