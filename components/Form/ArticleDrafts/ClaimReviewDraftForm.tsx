import { Badge, Divider } from 'antd';
import dayjs from 'dayjs';
import { Plus, X } from 'react-feather';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import Tagger from '@/bases/Tagger/Tagger';
import { TextArea } from '@/bases/Textarea';
import Card from '@/components/Card/Card';
import { AiVerificationType } from '@/constants/aiVerification';
import { DistortionType } from '@/constants/distortionType';
import { MediaFormat, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';

export default function ClaimReviewDraftForm(props: {
  claimReview: any;
  handleUpdate: any;
  type: ArticleType;
  formUrl: string;
  index: number;
  preview: boolean;
}) {
  const claimReview = props.claimReview;
  const preview = props.preview;

  return (
    <>
      <Divider style={{ margin: '8px 0' }} />
      <div className="w-full">
        {claimReview.claimReviewed != claimReview.claimReviewedNative && props.preview && (
          <Badge.Ribbon text="Translated with AI">
            <TextArea
              type="text"
              minLength={10}
              required
              value={claimReview.claimReviewed}
              onChange={v =>
                props.handleUpdate({
                  ...claimReview,
                  claimReviewed: v.target.value
                })
              }
              label="Claim (In english)"
              placeholder="Hours quoted in Spain to grow by 8.3% from 2019 despite what Figaredo said"
            />
          </Badge.Ribbon>
        )}
      </div>

      <TextArea
        label="Claim"
        value={claimReview.claimReviewedNative}
        onChange={v =>
          props.handleUpdate({
            ...claimReview,
            claimReviewedNative: v.target.value
          })
        }
        type="text"
        minLength={10}
        required
        placeholder="Quoted hours are falling in Spain"
        disabled={preview}
      />
      <Row align="SPACE">
        <Select
          label="Rating"
          required
          defaultValue={claimReview?.reviewRating}
          options={[
            { label: 'Rating', value: '' },
            ...Object.entries(ReviewRating).map(v => ({
              value: v[1].split('_').join(' '),
              label: v[1].split('_').join(' ')
            }))
          ]}
          onChange={v => props.handleUpdate({ ...claimReview, reviewRating: v })}
          disabled={preview}
        />
      </Row>
      <Select
        disabled={preview}
        label="Multiclaim"
        defaultValue={claimReview?.multiclaim ? 'true' : 'false'}
        options={[
          {
            label: 'Yes',
            value: 'true'
          },
          {
            label: 'No',
            value: 'false'
          }
        ]}
        onChange={v => props.handleUpdate({ ...claimReview, multiclaim: v === 'true' })}
        required
      />
      <Tagger
        value={claimReview?.distortionType}
        options={[
          ...Object.entries(DistortionType).map(([, value]) => ({
            label: value.split('_').join(' '),
            value: value.split('_').join(' ')
          }))
        ]}
        onChange={v => props.handleUpdate({ ...claimReview, distortionType: v })}
        mode="multiple"
        label="Distortion type"
        disabled={preview}
        required
      />
      <Tagger
        value={claimReview?.aiVerification}
        options={[
          ...Object.entries(AiVerificationType).map(([, value]) => ({
            label: value.split('_').join(' '),
            value: value.split('_').join(' ')
          }))
        ]}
        onChange={v => props.handleUpdate({ ...claimReview, aiVerification: v })}
        mode="multiple"
        label="AI verification"
        disabled={preview}
      />
      {((!preview || claimReview?.appearances?.length) && props.type === ArticleType.Factcheck) > 0 && (
        <Input requiredHide label="Claim appearances details" required={claimReview?.appearances?.length > 0}>
          {claimReview?.appearances?.map((appearance: any, appearanceIndex: number) => (
            <div key={`${props.formUrl}_appearance_${appearanceIndex}`}>
              <Card
                key={`card_${props.formUrl}_appearance_${appearanceIndex}`}
                style={{
                  marginBottom: 8
                }}
                title={`Claim appearance #${appearanceIndex + 1}`}
              >
                <Input
                  label="URL"
                  pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                  placeholder="https://example.com/factchecking/article-010101"
                  key={`${props.formUrl}_appearance_${appearanceIndex}_URL`}
                  value={appearance?.url}
                  required
                  onChange={v =>
                    props.handleUpdate({
                      ...claimReview,
                      appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                        if (_appearanceIndex === appearanceIndex) {
                          return {
                            ..._appearance,
                            url: v.target.value
                          };
                        }
                        return _appearance;
                      })
                    })
                  }
                  disabled={preview}
                />

                <Row align="SPACE">
                  <Select
                    label="Platform"
                    required={true}
                    defaultValue={appearance?.platform}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_platform`}
                    options={[
                      { label: 'Select platform where appearance was found', value: '' },
                      ...Object.entries(Platform).map(([key, value]) => ({
                        label: key.split('_').join(' '),
                        value: value.split('_').join(' ')
                      }))
                    ]}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              platform: v
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                  <Select
                    label="Format"
                    required={true}
                    defaultValue={appearance?.difussionFormat}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_difussionFormat`}
                    options={[
                      { label: 'Select Diffusion format', value: '' },
                      ...Object.entries(MediaFormat).map(([key, value]) => ({
                        label: key.split('_').join(' '),
                        value: value.split('_').join(' ')
                      }))
                    ]}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              difussionFormat: v
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                </Row>
                <DatePicker
                  label="Claim appearance date"
                  required
                  value={appearance.appearanceDate ? dayjs(appearance.appearanceDate) : undefined}
                  onChange={v =>
                    props.handleUpdate({
                      ...claimReview,
                      appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                        if (_appearanceIndex === appearanceIndex) {
                          return {
                            ..._appearance,
                            appearanceDate: v
                          };
                        }
                        return _appearance;
                      })
                    })
                  }
                  disabled={preview}
                />
                <Input
                  label="Archive URL"
                  pattern="[Hh][Tt][Tt][Pp][Ss]?:\/\/(?:(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)(?:\.(?:[a-zA-Z\u00a1-\uffff0-9]+-?)*[a-zA-Z\u00a1-\uffff0-9]+)*(?:\.(?:[a-zA-Z\u00a1-\uffff]{2,}))(?::\d{2,5})?(?:\/[^\s]*)?"
                  placeholder="https://example.com/factchecking/article-010101"
                  key={`${props.formUrl}_appearance_${appearanceIndex}_archivedAt`}
                  value={appearance?.archivedAt}
                  onChange={v =>
                    props.handleUpdate({
                      ...claimReview,
                      appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                        if (_appearanceIndex === appearanceIndex) {
                          return {
                            ..._appearance,
                            archivedAt: v.target.value
                          };
                        }
                        return _appearance;
                      })
                    })
                  }
                  disabled={preview}
                />
                {!preview && appearanceIndex !== 0 && (
                  <Row align="RIGHT">
                    <span
                      className="c-pointer mt-2 c-pointer bg-danger"
                      onClick={() =>
                        props.handleUpdate({
                          ...claimReview,
                          appearances: claimReview.appearances.filter((_appearance: any, _appearanceIndex: any) => {
                            if (_appearanceIndex !== appearanceIndex) {
                              return _appearance;
                            }
                          })
                        })
                      }
                    >
                      <X size={14} /> Remove claim appearance
                    </span>
                  </Row>
                )}
              </Card>
            </div>
          ))}
          {!preview && (
            <span
              className="c-pointer"
              onClick={() => {
                props.handleUpdate({
                  ...claimReview,
                  appearances: [
                    ...(claimReview?.appearances || []),
                    {
                      url: '',
                      archivedAt: '',
                      associatedMedia: '',
                      associatedMediaType: '',
                      difussionFormat: '',
                      appearanceDate: '',
                      platform: ''
                    }
                  ]
                });
              }}
            >
              <Plus size={14} /> Add claim appearance
            </span>
          )}
        </Input>
      )}
    </>
  );
}
