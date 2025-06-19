import { Topic } from '@/constants/topics';

export const includeLegacyTopics = (topic: string) => {
  if (topic === normalizeTopic(Topic.FossilFuels)) {
    return `${Topic.FossilFuels}`;
  }
  if (topic === normalizeTopic(Topic.Waste)) {
    return `${Topic.Waste}`;
  }
  if (topic === normalizeTopic(Topic.Other)) {
    return `${Topic.Other}`;
  }
  return topic;
};

export const normalizeTopic = (topic: string) => {
  if (topic === Topic.FossilFuels || topic === Topic.Waste || topic === Topic.Other) {
    return topic?.replace('(old) ', '');
  }
  return topic;
};

export const normalizeSubTopic = (topic: string, subTopic: string) => {
  if (topic === normalizeTopic(Topic.FossilFuels) || topic === normalizeTopic(Topic.Waste) || topic === normalizeTopic(Topic.Other)) {
    return subTopic?.replace('(old) ', '');
  }
  return subTopic;
};
