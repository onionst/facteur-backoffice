import { notification } from 'antd';
import { ReactNode, createContext, useContext, useState } from 'react';
import { NOTIFICATIONS_CONFIG } from '@/constants/notifications.constant';
import { Trending } from '@/dtos/trendings/trending.dto';

export type TrendingsContextProps = {
  trendings: Trending[];
  fetchTrendings: () => Promise<void>;
};
export const TrendingsContext = createContext<TrendingsContextProps>(
  // @ts-ignore
  {}
);

export type TrendingsProviderProps = {
  children: ReactNode;
};
export const TrendingsProvider = (props: TrendingsProviderProps) => {
  const [trendings, setTrendings] = useState<Trending[]>([]);

  const fetchTrendings = async () => {
    try {
      setTrendings([
        {
          NARRATIVE: 'Misinformation and false incidents related to Middle Eastern conflicts',
          EXPLANATION:
            "This group of claims contains misinformation regarding various incidents related to Middle Eastern conflicts, such as the supposed death of IDF's deadliest sniper, attacks on oil tankers, U.S military actions, or politically motivated images and videos. These claims seem to be aimed at spreading false narratives or propaganda about ongoing conflicts and tensions in the Middle East.",
          EXAMPLES: [
            {
              CLAIM: "The image shows IDF's deadliest sniper Shafas Lavie who was killed by Hamas.",
              TRANSLATION: "The image shows IDF's deadliest sniper Shafas Lavie who was killed by Hamas."
            },
            {
              CLAIM: 'Images show Taylor Swift wearing an anti-Trump t-shirt',
              TRANSLATION: 'Images show Taylor Swift wearing an anti-Trump t-shirt'
            }
          ]
        },
        {
          NARRATIVE: 'Cultural and religious misinformation or satire',
          EXPLANATION:
            'The second narrative consists of a mix of misinterpreted phrases, cultural satire, political commentary, and potentially deliberate misrepresentations about religious teachings in certain countries. The claims here seem to parody or criticize cultural nuances, religious practices, and political actions within diverse societies, and could be seen as attempts at humor or social critique.',
          EXAMPLES: [
            {
              CLAIM:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'",
              TRANSLATION:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'"
            },
            {
              CLAIM: 'அயோத்தி இராமர் கோவிலில் பணம் குவிகிறது… திருப்பதி கோவில் போல் அயோத்தி ராமர் கோயில். உருவெடுக்கும் ஜெய் ஸ்ரீ ராம்',
              TRANSLATION:
                'Money is being collected at the Ayodhya Ram temple... just like the Tirupati temple, the Ayodhya Ram temple is gathering funds. Hail Lord Ram is taking shape.'
            }
          ]
        },
        {
          NARRATIVE: 'Cultural and religious misinformation or satire',
          EXPLANATION:
            'The second narrative consists of a mix of misinterpreted phrases, cultural satire, political commentary, and potentially deliberate misrepresentations about religious teachings in certain countries. The claims here seem to parody or criticize cultural nuances, religious practices, and political actions within diverse societies, and could be seen as attempts at humor or social critique.',
          EXAMPLES: [
            {
              CLAIM:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'",
              TRANSLATION:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'"
            },
            {
              CLAIM: 'அயோத்தி இராமர் கோவிலில் பணம் குவிகிறது… திருப்பதி கோவில் போல் அயோத்தி ராமர் கோயில். உருவெடுக்கும் ஜெய் ஸ்ரீ ராம்',
              TRANSLATION:
                'Money is being collected at the Ayodhya Ram temple... just like the Tirupati temple, the Ayodhya Ram temple is gathering funds. Hail Lord Ram is taking shape.'
            }
          ]
        },
        {
          NARRATIVE: 'Cultural and religious misinformation or satire',
          EXPLANATION:
            'The second narrative consists of a mix of misinterpreted phrases, cultural satire, political commentary, and potentially deliberate misrepresentations about religious teachings in certain countries. The claims here seem to parody or criticize cultural nuances, religious practices, and political actions within diverse societies, and could be seen as attempts at humor or social critique.',
          EXAMPLES: [
            {
              CLAIM:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'",
              TRANSLATION:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'"
            },
            {
              CLAIM: 'அயோத்தி இராமர் கோவிலில் பணம் குவிகிறது… திருப்பதி கோவில் போல் அயோத்தி ராமர் கோயில். உருவெடுக்கும் ஜெய் ஸ்ரீ ராம்',
              TRANSLATION:
                'Money is being collected at the Ayodhya Ram temple... just like the Tirupati temple, the Ayodhya Ram temple is gathering funds. Hail Lord Ram is taking shape.'
            }
          ]
        },
        {
          NARRATIVE: 'Cultural and religious misinformation or satire',
          EXPLANATION:
            'The second narrative consists of a mix of misinterpreted phrases, cultural satire, political commentary, and potentially deliberate misrepresentations about religious teachings in certain countries. The claims here seem to parody or criticize cultural nuances, religious practices, and political actions within diverse societies, and could be seen as attempts at humor or social critique.',
          EXAMPLES: [
            {
              CLAIM:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'",
              TRANSLATION:
                "Instead of saying 'I love you' in Spanish, you say 'Yo quiero comer culo,' which in English means 'You are the light of my life.'"
            },
            {
              CLAIM: 'அயோத்தி இராமர் கோவிலில் பணம் குவிகிறது… திருப்பதி கோவில் போல் அயோத்தி ராமர் கோயில். உருவெடுக்கும் ஜெய் ஸ்ரீ ராம்',
              TRANSLATION:
                'Money is being collected at the Ayodhya Ram temple... just like the Tirupati temple, the Ayodhya Ram temple is gathering funds. Hail Lord Ram is taking shape.'
            }
          ]
        }
      ]);
    } catch (err: any) {
      console.error(err);
      if (typeof err?.response?.data?.message === 'object') {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: err?.response?.data?.message[0]
        });
      } else {
        notification.error({
          ...NOTIFICATIONS_CONFIG.error,
          message: 'Error',
          description: 'Please try again later'
        });
      }
    }
  };

  const context = {
    trendings,
    fetchTrendings
  };
  return <TrendingsContext.Provider value={context}>{props.children}</TrendingsContext.Provider>;
};

export const useTrendings = () => useContext(TrendingsContext);
