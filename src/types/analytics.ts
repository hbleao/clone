export type PageChange = {
  id: string;
  pageId: string;
  pageName: string;
  timestamp: Date;
  userId: string;
  userName: string;
  action: 'copy' | 'edit' | 'publish';
  changeData: {
    previousVersion?: string;
    newVersion: string;
    differences?: string[];
  };
};

export type PageAnalytics = {
  totalChanges: number;
  changesByUser: {
    userId: string;
    userName: string;
    changes: number;
  }[];
  changesByDate: {
    date: string;
    changes: number;
  }[];
  mostEditedSections: {
    sectionName: string;
    changes: number;
  }[];
};
