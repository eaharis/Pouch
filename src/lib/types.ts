export type Item = {
  id?: number;
  url: string;
  title: string;
  addedAt: number;
  contentId?: number;
};

export type Content = {
  id?: number;
  itemId: number;
  html: string;  // simplified HTML
  text: string;  // plain text for quick preview
};
