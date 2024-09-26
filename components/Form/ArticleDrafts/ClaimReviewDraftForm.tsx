import { Divider } from 'antd';
import dayjs from 'dayjs';
import { Plus, X } from 'react-feather';
import { ArticleType } from '../SelectArticleType/SelectArticleType';
import { DatePicker } from '@/bases/DatePicker/DatePicker';
import { Input } from '@/bases/Input';
import InputUploader from '@/bases/InputUploader/InputUploader';
import Row from '@/bases/Row/Row';
import Select from '@/bases/Select/Select';
import { TextArea } from '@/bases/Textarea';
import Card from '@/components/Card/Card';
import { FILE_TYPES } from '@/constants/accept';
import { MediaFormat, MediaType, Platform } from '@/constants/media';
import { PoliticalParty } from '@/constants/politicalParty';
import { ReviewRating } from '@/constants/ratings';

export default function ClaimReviewDraftForm(props: {
  claimReview: any;
  handleUpdate: any;
  type: ArticleType;
  formUrl: string;
  preview: boolean;
}) {
  const claimReview = props.claimReview;
  const preview = props.preview;

  return (
    <div>
      <Divider style={{ margin: '8px 0' }} />
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
        <DatePicker
          label="Date of claim publication"
          value={
            dayjs(claimReview.itemReviewed.datePublished).isValid()
              ? dayjs(claimReview.itemReviewed.datePublished)
              : claimReview.itemReviewed.datePublished
          }
          onChange={v => props.handleUpdate({ ...claimReview, itemReviewed: { ...claimReview.itemReviewed, datePublished: v } })}
          disabled={preview}
        />
      </Row>

      {props.type === ArticleType.Factcheck && (
        <Row align="SPACE">
          <Input
            value={claimReview.itemReviewed.author}
            onChange={v => props.handleUpdate({ ...claimReview, itemReviewed: { ...claimReview.itemReviewed, author: v.target.value } })}
            label="Person"
            placeholder="John Doe"
            disabled={preview}
          />

          <Select
            label="EU party related to the claim"
            defaultValue={claimReview?.itemReviewed?.politicalParty}
            options={[
              { label: 'Political party', value: '' },
              ...Object.entries(PoliticalParty).map(v => ({
                value: v[1].split('_').join(' '),
                label: v[1].split('_').join(' ')
              }))
            ]}
            onChange={v =>
              props.handleUpdate({
                ...claimReview,
                itemReviewed: {
                  ...claimReview.itemReviewed,
                  politicalParty: v
                }
              })
            }
            disabled={preview}
          />
        </Row>
      )}

      {(!preview || claimReview?.itemReviewed?.appearances.length) > 0 && (
        <Input requiredHide label="Claim appearances details" required={claimReview?.itemReviewed?.appearances?.length > 0}>
          {claimReview?.itemReviewed?.appearances?.map((appearance: any, appearanceIndex: number) => (
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
                  onChange={v =>
                    props.handleUpdate({
                      ...claimReview,
                      itemReviewed: {
                        ...claimReview.itemReviewed,
                        appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              url: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      }
                    })
                  }
                  disabled={preview}
                />

                <Row align="SPACE">
                  <Select
                    label="Platform"
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
                        itemReviewed: {
                          ...claimReview.itemReviewed,
                          appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                            if (_appearanceIndex === appearanceIndex) {
                              return {
                                ..._appearance,
                                platform: v
                              };
                            }
                            return _appearance;
                          })
                        }
                      })
                    }
                    disabled={preview}
                  />
                  <Select
                    label="Format"
                    defaultValue={appearance?.mediaFormat}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_mediaFormat`}
                    options={[
                      { label: 'Select media format', value: '' },
                      ...Object.entries(MediaFormat).map(([key, value]) => ({
                        label: key.split('_').join(' '),
                        value: value.split('_').join(' ')
                      }))
                    ]}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        itemReviewed: {
                          ...claimReview.itemReviewed,
                          appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                            if (_appearanceIndex === appearanceIndex) {
                              return {
                                ..._appearance,
                                mediaFormat: v
                              };
                            }
                            return _appearance;
                          })
                        }
                      })
                    }
                    disabled={preview}
                  />
                </Row>

                <Row align="SPACE">
                  <InputUploader
                    accept={{
                      'image/png': FILE_TYPES.images,
                      'audio/mp3': FILE_TYPES.audio,
                      'video/mp4': FILE_TYPES.videos,
                      'application/*': FILE_TYPES.files
                    }}
                    label="Associated multimedia"
                    value={appearance?.associatedMedia}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_associatedMedia`}
                    onUrlChange={(url: string) => {
                      props.handleUpdate({
                        ...claimReview,
                        itemReviewed: {
                          ...claimReview.itemReviewed,
                          appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                            if (_appearanceIndex === appearanceIndex) {
                              return {
                                ..._appearance,
                                associatedMedia: url
                              };
                            }
                            return _appearance;
                          })
                        }
                      });
                    }}
                    placeholder="Upload file"
                    disabled={preview}
                  />

                  <Select
                    label="Associated multimedia format"
                    defaultValue={appearance?.associatedMediaType}
                    key={`${props.formUrl}_appearance_${appearanceIndex}_associatedMediaType`}
                    options={[
                      { label: 'Select associated media format', value: '' },
                      ...Object.entries(MediaType).map(([key, value]) => ({
                        label: key.split('_').join(' '),
                        value: value.split('_').join(' ')
                      }))
                    ]}
                    onChange={v =>
                      props.handleUpdate({
                        ...claimReview,
                        itemReviewed: {
                          ...claimReview.itemReviewed,
                          appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                            if (_appearanceIndex === appearanceIndex) {
                              return {
                                ..._appearance,
                                associatedMediaType: v
                              };
                            }
                            return _appearance;
                          })
                        }
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
                      itemReviewed: {
                        ...claimReview.itemReviewed,
                        appearances: claimReview.itemReviewed.appearances.map((_appearance: any, _appearanceIndex: any) => {
                          if (_appearanceIndex === appearanceIndex) {
                            return {
                              ..._appearance,
                              archivedAt: v.target.value
                            };
                          }
                          return _appearance;
                        })
                      }
                    })
                  }
                  disabled={preview}
                />
                {!preview && (
                  <Row align="RIGHT">
                    <span
                      className="c-pointer mt-2"
                      onClick={() =>
                        props.handleUpdate({
                          ...claimReview,
                          itemReviewed: {
                            ...claimReview.itemReviewed,
                            appearances: claimReview.itemReviewed.appearances.filter((_appearance: any, _appearanceIndex: any) => {
                              if (_appearanceIndex !== appearanceIndex) {
                                return _appearance;
                              }
                            })
                          }
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
                const id = Date.now();
                props.handleUpdate({
                  ...claimReview,
                  itemReviewed: {
                    ...claimReview.itemReviewed,
                    appearances: [
                      ...(claimReview?.itemReviewed?.appearances || []),
                      {
                        id,
                        url: '',
                        archivedAt: '',
                        associatedMedia: '',
                        associatedMediaType: '',
                        mediaFormat: '',
                        platform: ''
                      }
                    ]
                  }
                });
              }}
            >
              <Plus size={14} /> Add claim appearance
            </span>
          )}
        </Input>
      )}
    </div>
  );
}
