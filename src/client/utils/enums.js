import { HomeSVG, ProfileSVG, FriendsSVG, LogoutSVG } from '../main/components/svgs/nav_bar_svgs';
import { AddPhotosSVG, SharePostSVG, VisibleToSVG } from '../main/components/svgs/create_post_svgs';
import { EveryoneSVG, OnlyMeSVG } from '../main/components/svgs/visibility_svgs';
import { LikeSVG, CommentSVG } from '../main/components/svgs/newsfeed_post_svgs';

export const RightNavBarPagesEnum = {
  Home: {
    name: 'בית',
    svg: HomeSVG,
    href: ""
  },
  Profile: {
    name: 'משחק',
    svg: ProfileSVG,
    href: "http://localhost:8000/index.html"
  },
  Friends: {
    name: 'חברים',
    svg: FriendsSVG
  },
  Logout: {
    name: 'התנתק',
    svg: LogoutSVG
  }
};

export const NewPostOptionsEnum = {
  AddPhotos: {
    tooltip: 'הוסף תמונה',
    svg: AddPhotosSVG
  },
  SharePost: {
    tooltip: 'שתף את הפוסט!',
    svg: SharePostSVG,
    label: 'Post',
  },
  VisibleTo: {
    tooltip: 'למי חשוף',
    svg: VisibleToSVG
  }
};

export const PrivacyOptionsEnum = {
  Global: {
    name: 'Global',
    svg: EveryoneSVG
  },
  Private: {
    name: 'Private',
    svg: OnlyMeSVG
  }
};

export const PostStatOptionsEnum = {
  Likes: {
    name: 'Likes',
    svg: LikeSVG
  },
  Comments: {
    name: 'Comments',
    svg: CommentSVG
  }
};

export const InputTypesEnum = {
  First: {
    type: 'text',
    name: 'first',
    label: 'שם פרטי'
  },
  Last: {
    type: 'text',
    name: 'last',
    label: 'שם משפחה'
  },
  Email: {
    type: 'text',
    name: 'email',
    label: 'אימייל'
  },
  Password: {
    type: 'password',
    name: 'password',
    label: 'סיסמא'
  }
};

export const CloudinaryFieldsEnum = {
  Endpoint: 'https://api.cloudinary.com/v1_1/yossisaadi/image/upload',
  UploadPreset: 'cldnry_facefeka'
};