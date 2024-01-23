import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './auth.context';
import useWindowSize from '@/hooks/useWindowWidth';
import { AccountModal } from '@/modals/Account.modal';
import { DeleteArticleModal } from '@/modals/articles/DeleteArticle.modal';
import { DownloadArticlesModal } from '@/modals/articles/DownloadArticles.modal';
import { DownloadEE24ArticlesModal } from '@/modals/ee24/DownloadEE24Articles.modal';
import { CreateOrganizationModal } from '@/modals/organizations/CreateOrganization.modal';
import { DeleteOrganizationModal } from '@/modals/organizations/DeleteOrganization.modal';
import { DownloadOrganizationsModal } from '@/modals/organizations/DownloadOrganizations.modal';
import { EditOrganizationModal } from '@/modals/organizations/EditOrganization.modal';
import { RestoreOrganizationModal } from '@/modals/organizations/RestoreOrganization.modal';
import { TFAEmailSentModal } from '@/modals/TFAEmailSent.modal';
import { DeleteUserModal } from '@/modals/users/DeleteUser.modal';
import { DeleteUserInvitationModal } from '@/modals/users/DeleteUserInvitation.modal';
import { DownloadUsersModal } from '@/modals/users/DownloadUsers.modal';
import { EditUserModal } from '@/modals/users/EditUser.modal';
import { InviteUsersModal } from '@/modals/users/InviteUsers.modal';
import { RestoreUserModal } from '@/modals/users/RestoreUser.modal';

export const ModalContext = createContext<{
  auth: {
    showTFAEmailSent: () => void;
    showAccount: () => void;
  };
  organizations: {
    showCreateOrganization: () => void;
    showEditOrganization: (id: string) => void;
    showDeleteOrganization: (id: string) => void;
    showDownloadOrganizations: () => void;
    showRestoreOrganization: (id: string) => void;
  };
  users: {
    showInviteUsers: () => void;
    showDeleteUserInvitation: (id: string) => void;
    showDeleteUser: (id: string) => void;
    showEditUser: (id: string) => void;
    showRestoreUser: (id: string) => void;
    showDownloadUsers: () => void;
  };
  articles: {
    showDeleteArticle: (id: string, redirect?: string) => void;
    showDownloadArticles: (filter: any) => void;
  };
  ee24: {
    showDownloadEE24Articles: (filter: any) => void;
  };
  // @ts-ignore
}>({});

export const ModalProvider = (props: { children: any }) => {
  const { width } = useWindowSize();
  const { session } = useAuth();
  // <--- auth --->
  const [emailSentActive, setEmailSentActive] = useState<boolean>(false);
  const [accountActive, setAccountActive] = useState<boolean>(false);
  // <--- auth --->

  // <--- organizations --->
  const [createOrganizationActive, setCreateOrganizationActive] = useState<string>('');
  const [downloadOrganizationsActive, setDownloadOrganizationsActive] = useState<string>('');
  const [editOrganizationActive, setEditOrganizationActive] = useState<string>('');
  const [deleteOrganizationActive, setDeleteOrganizationActive] = useState<string>('');
  const [restoreOrganizationActive, setRestoreOrganizationActive] = useState<string>('');
  // <!--- organizations --->

  // <--- users --->
  const [inviteUsersActive, setInviteUsersActive] = useState<string>('');
  const [downloadUsersActive, setDownloadUsersActive] = useState<string>('');
  const [deleteUserInvitationActive, setDeleteUserInvitationActive] = useState<string>('');
  const [deleteUserActive, setDeleteUserActive] = useState<string>('');
  const [editUserActive, setEditUserActive] = useState<string>('');
  const [restoreUserActive, setRestoreUserActive] = useState<string>('');
  // <!--- users --->

  // <--- articles --->
  const [deleteArticleActive, setDeleteArticleActive] = useState<string>('');
  const [deleteArticleRedirect, setDeleteArticleRedirect] = useState<string>('');
  const [downloadArticlesActive, setDownloadArticlesActive] = useState<string>('');
  const [downloadArticlesFilter, setDownloadArticlesFilter] = useState<any>({});
  // <!--- articles --->

  // <--- ee24 --->
  const [downloadEE24ArticlesActive, setDownloadEE24ArticlesActive] = useState<string>('');
  const [downloadEE24ArticlesFilter, setDownloadEE24ArticlesFilter] = useState<any>({});
  // <!--- ee24 --->

  useEffect(() => {
    setEmailSentActive(false);
    setAccountActive(false);
    setCreateOrganizationActive('');
    setEditOrganizationActive('');
    setDeleteOrganizationActive('');
    setRestoreOrganizationActive('');
    setInviteUsersActive('');
    setDeleteUserInvitationActive('');
    setDeleteUserActive('');
    setEditUserActive('');
    setRestoreUserActive('');
  }, [session]);

  const context = {
    auth: {
      showTFAEmailSent: () => setEmailSentActive(true),
      showAccount: () => setAccountActive(true)
    },
    organizations: {
      showDownloadOrganizations: () => setDownloadOrganizationsActive(Date.now().toString()),
      showCreateOrganization: () => setCreateOrganizationActive(Date.now().toString()),
      showEditOrganization: (id: string) => setEditOrganizationActive(id),
      showDeleteOrganization: (id: string) => setDeleteOrganizationActive(id),
      showRestoreOrganization: (id: string) => setRestoreOrganizationActive(id)
    },
    users: {
      showDownloadUsers: () => setDownloadUsersActive(Date.now().toString()),
      showInviteUsers: () => setInviteUsersActive(Date.now().toString()),
      showDeleteUserInvitation: (id: string) => setDeleteUserInvitationActive(id),
      showDeleteUser: (id: string) => setDeleteUserActive(id),
      showEditUser: (id: string) => setEditUserActive(id),
      showRestoreUser: (id: string) => setRestoreUserActive(id)
    },
    articles: {
      showDeleteArticle: (id: string, redirect?: string) => {
        setDeleteArticleActive(id);
        setDeleteArticleRedirect(redirect || '');
      },
      showDownloadArticles: (filter: any) => {
        setDownloadArticlesFilter(filter);
        setTimeout(() => {
          setDownloadArticlesActive(Date.now().toString());
        }, 100);
      }
    },
    ee24: {
      showDownloadEE24Articles: (filter: any) => {
        setDownloadEE24ArticlesFilter(filter);
        setTimeout(() => {
          setDownloadEE24ArticlesActive(Date.now().toString());
        }, 100);
      }
    }
  };

  return (
    <ModalContext.Provider value={context}>
      <>
        <TFAEmailSentModal footer={null} width={350} open={emailSentActive} onCancel={() => setEmailSentActive(false)} />
        <AccountModal
          placement="right"
          styles={{ header: { display: 'none' }, content: { padding: 20 } }}
          footer={null}
          width={width <= 440 ? width - 40 : 400}
          open={accountActive}
          onClose={() => setAccountActive(false)}
        />

        <CreateOrganizationModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={createOrganizationActive != ''}
          id={createOrganizationActive}
          onCancel={() => setCreateOrganizationActive('')}
        />
        <EditOrganizationModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={editOrganizationActive != ''}
          id={editOrganizationActive}
          onCancel={() => setEditOrganizationActive('')}
        />
        <DeleteOrganizationModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={deleteOrganizationActive != ''}
          id={deleteOrganizationActive}
          onCancel={() => setDeleteOrganizationActive('')}
        />
        <DownloadOrganizationsModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={downloadOrganizationsActive != ''}
          id={downloadOrganizationsActive}
          onCancel={() => setDownloadOrganizationsActive('')}
        />
        <RestoreOrganizationModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={restoreOrganizationActive != ''}
          id={restoreOrganizationActive}
          onCancel={() => setRestoreOrganizationActive('')}
        />
        <InviteUsersModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          onCancel={() => setInviteUsersActive('')}
          id={inviteUsersActive}
          open={inviteUsersActive != ''}
        />
        <DeleteUserInvitationModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          onCancel={() => setDeleteUserInvitationActive('')}
          id={deleteUserInvitationActive}
          open={deleteUserInvitationActive != ''}
        />
        <DeleteUserModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          onCancel={() => setDeleteUserActive('')}
          id={deleteUserActive}
          open={deleteUserActive != ''}
        />
        <DownloadUsersModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={downloadUsersActive != ''}
          id={downloadUsersActive}
          onCancel={() => setDownloadUsersActive('')}
        />
        <EditUserModal footer={null} width={424} onCancel={() => setEditUserActive('')} id={editUserActive} open={editUserActive != ''} />
        <RestoreUserModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={restoreUserActive != ''}
          id={restoreUserActive}
          onCancel={() => setRestoreUserActive('')}
        />
        <DeleteArticleModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          redirect={deleteArticleRedirect}
          onCancel={() => {
            setDeleteArticleActive('');
            setDeleteArticleRedirect('');
          }}
          id={deleteArticleActive}
          open={deleteArticleActive != ''}
        />
        <DownloadArticlesModal
          footer={null}
          width={width <= 464 ? width - 40 : 424}
          open={downloadArticlesActive != ''}
          filter={downloadArticlesFilter}
          id={downloadArticlesActive}
          onCancel={() => {
            setDownloadArticlesActive('');
            setDownloadArticlesFilter({});
          }}
        />
        <DownloadEE24ArticlesModal
          footer={null}
          filter={downloadEE24ArticlesFilter}
          width={width <= 464 ? width - 40 : 424}
          open={downloadEE24ArticlesActive != ''}
          id={downloadEE24ArticlesActive}
          onCancel={() => {
            setDownloadEE24ArticlesActive('');
            setDownloadEE24ArticlesFilter({});
          }}
        />
        {props.children}
      </>
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
