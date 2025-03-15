import { useQuery } from '@tanstack/react-query';
import { fetchVariables, searchVariables } from '../services/api';
import { Tag } from '../store/formulaStore';

export const useVariables = (searchTerm: string = '') => {
  const queryKey = searchTerm ? ['variables', searchTerm] : ['variables'];
  
  return useQuery<Tag[]>({
    queryKey,
    queryFn: () => searchTerm ? searchVariables(searchTerm) : fetchVariables(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    placeholderData: (previousData) => previousData, // This replaces keepPreviousData
  });
}; 