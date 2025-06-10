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
import { ClaimantInfluence, ClaimantType } from '@/constants/climant';
import { DistortionType } from '@/constants/distortionType';
import { HarmEscalation } from '@/constants/harmEscalation';
import { MediaFormat, Platform } from '@/constants/media';
import { ReviewRating } from '@/constants/ratings';

export default function ClaimReviewDraftForm(props: {
  claimReview: any;
  handleUpdate: any;
  type: ArticleType;
  formUrl: string;
  index: number;
  preview: boolean;
  imported: boolean;
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
          onChange={v =>
            v !== ReviewRating.AIGenerated
              ? props.handleUpdate({ ...claimReview, reviewRating: v, aiVerification: [] })
              : props.handleUpdate({ ...claimReview, reviewRating: v })
          }
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
      />
      <Row align="SPACE">
        <Select
          disabled={preview}
          label="Harm"
          defaultValue={claimReview?.harm ? 'true' : claimReview?.harm === false ? 'false' : ''}
          options={[
            { label: 'Select harm', value: '' },
            {
              label: 'Yes',
              value: 'true'
            },
            {
              label: 'No',
              value: 'false'
            }
          ]}
          onChange={v =>
            props.handleUpdate({
              ...claimReview,
              harm: v === 'true' ? true : v === 'false' ? false : undefined,
              harmEscalation: v !== 'true' ? undefined : claimReview.harmEscalation
            })
          }
        />
        <Select
          label="Harm escalation"
          value={claimReview?.harmEscalation ? claimReview.harmEscalation : ''}
          options={[
            { label: 'Select the harm escalation', value: '' },
            ...Object.entries(HarmEscalation).map(([, value]) => ({
              label: value.split('_').join(' '),
              value: value.split('_').join(' ')
            }))
          ]}
          onChange={v =>
            props.handleUpdate({
              ...claimReview,
              harmEscalation: v
            })
          }
          disabled={preview || claimReview.harm === false}
        />
      </Row>
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
        maxTagCount="responsive"
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
        disabled={preview || claimReview?.reviewRating !== ReviewRating.AIGenerated}
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
                <Row align="SPACE">
                  <Select
                    disabled={preview}
                    label="Action taken by platform"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_actionTaken`}
                    defaultValue={appearance?.actionTaken ? 'true' : appearance?.actionTaken === false ? 'false' : ''}
                    options={[
                      { label: 'Select ...', value: '' },
                      {
                        label: 'Yes',
                        value: 'true'
                      },
                      {
                        label: 'No',
                        value: 'false'
                      }
                    ]}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              actionTaken: v === 'true'
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                  />

                  <DatePicker
                    label="Claim appearance date"
                    required={props.imported !== true}
                    value={appearance.appearanceDate ? dayjs(appearance.appearanceDate) : undefined}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              appearanceDate: v?.toDate()
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                </Row>

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
                <Row align="SPACE">
                  <Input
                    label="Views"
                    type="number"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_views`}
                    value={appearance?.views}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              views: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                  <Input
                    label="Likes"
                    type="number"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_likes`}
                    value={appearance?.likes}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              likes: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                  <Input
                    label="Comments"
                    type="number"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_comments`}
                    value={appearance?.comments}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              comments: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                  <Input
                    label="Shares"
                    type="number"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_shares`}
                    value={appearance?.shares}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              shares: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                </Row>
                <Row align="SPACE">
                  <Input
                    label="Claimant"
                    type="text"
                    key={`${props.formUrl}_appearance_${appearanceIndex}_claimant`}
                    value={appearance?.claimant}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        appearances: claimReview.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              claimant: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                </Row>
                <Row align="SPACE">
                  <Select
                    label="Claimant type"
                    defaultValue={appearance?.claimantType}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_claimantType`}
                    options={[
                      { label: 'Select the claimant type', value: '' },
                      ...Object.entries(ClaimantType).map(([key, value]) => ({
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
                              claimantType: v
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                  <Select
                    label="Claimant influence"
                    defaultValue={appearance?.claimantInfluence}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_claimantInfluence`}
                    options={[
                      { label: 'Select the claimant influence', value: '' },
                      ...Object.entries(ClaimantInfluence).map(([key, value]) => ({
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
                              claimantInfluence: v
                            };
                          }
                          return _appearance;
                        })
                      })
                    }
                    disabled={preview}
                  />
                </Row>
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
                      actionTaken: '',
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
