export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4 text-teal-600">اتصل بنا</h1>
      <p className="text-gray-600 leading-relaxed mb-6">
        يمكنك التواصل معنا من خلال تعبئة النموذج أدناه أو عبر البريد الإلكتروني.
      </p>
      <form className="space-y-4">
        <input
          type="text"
          placeholder="الاسم"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <input
          type="email"
          placeholder="البريد الإلكتروني"
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <textarea
          placeholder="رسالتك"
          rows={5}
          className="w-full p-3 border border-gray-300 rounded-lg"
        />
        <button
          type="submit"
          className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700"
        >
          إرسال
        </button>
      </form>
    </main>
  );
}
