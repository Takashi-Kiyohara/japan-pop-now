interface ReadingTimeProps {
  content: string;
}

export default function ReadingTime({ content }: ReadingTimeProps) {
  // Count words
  const wordCount = content.split(/\s+/).filter(word => word.length > 0).length;

  // Count images (markdown syntax ![alt](url) or HTML <img>)
  const imageMatches = content.match(/!\[.*?\]\(.*?\)|<img/g) || [];
  const imageCount = imageMatches.length;

  // Calculate reading time: 200 words per minute + 10 seconds per image
  const readingTimeMinutes = Math.ceil(wordCount / 200 + (imageCount * 10) / 60);

  if (readingTimeMinutes < 1) {
    return <span className="text-sm text-gray-600">Quick read</span>;
  }

  return (
    <span className="text-sm text-gray-600">
      {readingTimeMinutes} min read
    </span>
  );
}
