import { Topic } from '@/constants/topics';

export const includeLegacyTopics = (topic: string) => {
  if (topic === normalizeTopic(Topic.FossilFuels)) {
    return `${Topic.FossilFuels}`;
  }
  if (topic === normalizeTopic(Topic.Waste)) {
    return `${Topic.Waste}`;
  }
  return topic;
};

export const normalizeTopic = (topic: string) => {
  if (topic === Topic.FossilFuels) {
    return Topic.FossilFuels?.replace('(old) ', '');
  }
  if (topic === Topic.Waste) {
    return Topic.Waste?.replace('(old) ', '');
  }
  return topic;
};

export const normalizeSubTopic = (topic: string, subTopic: string) => {
  if (topic === normalizeTopic(Topic.FossilFuels)) {
    return subTopic?.replace('(old) ', '');
  }
  if (topic === normalizeTopic(Topic.Waste)) {
    return subTopic?.replace('(old) ', '');
  }
  return subTopic;
};
