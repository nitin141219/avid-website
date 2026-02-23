import {
  Building2,
  Calendar,
  CheckCircle2,
  Globe,
  Mail,
  MessageSquare,
  Phone,
  XCircle,
} from "lucide-react";
import React from "react";

const ViewContactUs = ({ data }: { data: any }) => {
  return (
    <div className="min-h-screen">
      <div className="">
        {/* Header */}
        <div className="flex md:flex-row flex-col justify-between md:items-center gap-4 mb-8">
          <div>
            <h1 className="font-bold text-slate-900 text-2xl">Inquiry Details</h1>
          </div>
        </div>

        <div className="gap-8 grid grid-cols-1 lg:grid-cols-3">
          {/* Main Content: Message & Inquiry Info */}
          <div className="space-y-6 lg:col-span-2">
            <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
              <div className="bg-slate-50/30 p-6 border-slate-100 border-b">
                <h2 className="flex items-center gap-2 font-semibold text-slate-800">
                  <MessageSquare size={18} className="text-indigo-500" />
                  Client Message
                </h2>
              </div>
              <div className="p-6">
                <p className="text-slate-700 leading-relaxed whitespace-pre-wrap">
                  {data?.message}
                </p>
              </div>
              <div className="flex flex-wrap gap-2 bg-slate-50/50 px-6 py-4 border-slate-100 border-t">
                {data?.inquiry_type?.map((type: string) => (
                  <span
                    key={type}
                    className="bg-indigo-50 px-3 py-1 rounded-full font-semibold text-indigo-700 text-xs uppercase tracking-wider"
                  >
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {/* Consent & Compliance */}
            <div className="bg-white p-6 border border-slate-200 rounded-xl">
              <h3 className="mb-4 font-bold text-slate-400 text-sm uppercase tracking-widest">
                Compliance
              </h3>
              <div className="space-y-4">
                {/* Privacy Policy Item */}
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    data?.agree_to_privacy_policy
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-rose-50/50 border-rose-100"
                  }`}
                >
                  {data?.agree_to_privacy_policy ? (
                    <CheckCircle2 size={18} className="mt-0.5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 text-rose-600 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">Privacy Compliance</span>
                    <span className="text-slate-500 text-xs">
                      User accepted terms and data processing policy.
                    </span>
                  </div>
                </div>

                {/* Marketing Consent Item */}
                <div
                  className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                    data?.receive_updates
                      ? "bg-emerald-50/50 border-emerald-100"
                      : "bg-slate-50 border-slate-100"
                  }`}
                >
                  {data?.receive_updates ? (
                    <CheckCircle2 size={18} className="mt-0.5 text-emerald-600 shrink-0" />
                  ) : (
                    <XCircle size={18} className="mt-0.5 text-slate-400 shrink-0" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold text-slate-900 text-sm">Marketing Opt-in</span>
                    <span className="text-slate-500 text-xs">
                      {data?.receive_updates
                        ? "Subscribed to product updates and technical communications."
                        : "User declined marketing and technical communications."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar: Contact Info */}
          <div className="space-y-6">
            <div className="bg-white shadow-sm p-6 border border-slate-200 rounded-xl">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex justify-center items-center bg-indigo-100 rounded-full w-12 h-12 font-bold text-indigo-600 text-lg">
                  {data?.first_name[0]}
                  {data?.last_name[0]}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 leading-tight">
                    {data?.first_name} {data?.last_name}
                  </h3>
                  <p className="text-slate-500 text-sm">{data?.company}</p>
                </div>
              </div>

              <div className="space-y-4">
                <InfoRow icon={<Mail size={16} />} label="Email" value={data?.email} />
                <InfoRow icon={<Phone size={16} />} label="Phone" value={data?.phone_number} />
                <InfoRow icon={<Building2 size={16} />} label="Company" value={data?.company} />
                <InfoRow icon={<Globe size={16} />} label="Location" value={data?.country} />
                <InfoRow
                  icon={<Calendar size={16} />}
                  label="Submitted"
                  value={new Date(data?.created_at).toLocaleDateString()}
                />
              </div>

              <hr className="my-6 border-slate-100" />

              <div>
                <h4 className="mb-3 font-bold text-slate-400 text-xs uppercase">
                  Preferred Methods
                </h4>
                <div className="flex flex-wrap gap-2">
                  {data?.preferred_contact_method?.map((m: string) => (
                    <span
                      key={m}
                      className="bg-slate-100 px-2 py-1 rounded text-slate-600 text-xs capitalize"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/* Reusable Info Row Component */
const InfoRow = ({
  icon,
  label,
  value,
  isLink = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  isLink?: boolean;
}) => (
  <div className="flex flex-col gap-1">
    <div className="flex items-center gap-2 text-slate-400">
      {icon}
      <span className="font-bold text-[11px] uppercase tracking-wider">{label}</span>
    </div>
    <span
      className={`text-sm font-medium ${isLink ? "text-indigo-600 hover:underline cursor-pointer" : "text-slate-700"}`}
    >
      {value}
    </span>
  </div>
);

export default ViewContactUs;
