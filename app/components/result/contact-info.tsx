interface ContactInfoProps {
  phoneNumber?: string;
  websiteUrl?: string;
}

export function ContactInfo({ phoneNumber, websiteUrl }: ContactInfoProps) {
  if (!phoneNumber && !websiteUrl) return null;

  return (
    <div className="mb-4">
      <h3 className="font-semibold text-gray-800 mb-2">Contact</h3>
      {phoneNumber && (
        <p className="text-gray-600 mb-1">📞 {phoneNumber}</p>
      )}
      {websiteUrl && (
        <a
          href={websiteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-red-600 hover:text-red-700"
        >
          🌐 Visit Website
        </a>
      )}
    </div>
  );
} 