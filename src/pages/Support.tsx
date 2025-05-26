import PageBreadcrumb from "../components/common/PageBreadCrumb";
import PageMeta from "../components/common/PageMeta";

export default function Support() {
  return (
    <>
      <PageMeta
        title="Support | TailAdmin - Next.js Admin Dashboard Template"
        description="This is the Support page for TailAdmin - React.js Tailwind CSS Admin Dashboard Template"
      />
      <PageBreadcrumb pageTitle="Support" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Support
        </h3>
        <div className="space-y-6">
          {/* Example: Add help resources, contact forms, etc. */}
          <div className="p-4 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800">
            <p className="text-gray-700 dark:text-gray-300">
              Support content goes here...
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
