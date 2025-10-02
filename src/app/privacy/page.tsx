import Link from "next/link";
export const metadata = {
  title: "Privacy Policy | LinkMail",
  description:
    "Learn how LinkMail's Chrome extension collects, uses, and protects your information.",
};

export default function PrivacyPolicyPage() {
  return (
    <main className="text-secondary font-tiempos-regular mx-auto max-w-3xl px-6 py-12 prose prose-invert prose-headings:font-semibold">
      
      <div className="fixed top-6 left-6 flex items-center mb-8 cursor-pointer">
        <Link href="/">
          <img
            src="/logo.png"
            alt="LinkMail Logo"
            className="h-10 w-8 mr-10"
            style={{ objectFit: "contain" }}
          />
        </Link>
      </div>
      
      <h1 className="text-primary font-tiempos-medium text-3xl mt-12">Privacy Policy</h1>
      <p className="mt-8 text-md opacity-80">Last Updated: March 28, 2025</p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Introduction</h2>
      <p>
        LinkMail (&quot;we&quot;, &quot;our&quot;, or &quot;us&quot;) is committed to protecting your privacy. This
        Privacy Policy explains how we collect, use, and safeguard your information when
        you use our Chrome extension.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Information We Collect</h2>
      <p>
        When you use LinkMail, we collect information that you provide and information that is
        collected automatically. If you choose to sign in with Google, we access your email
        address and name to identify your account. You may also provide profile details such as
        your name, college or university, graduation year, experiences, and skills. Within the
        extension, you can create custom email templates, and we process the content of emails you
        compose and send using the extension.
      </p>
      <br></br>
      <p>
        We also collect information automatically when you interact with the extension. When you
        use the extension on a LinkedIn profile, we temporarily process publicly available
        information from that profile, including the name, headline, about section, and
        professional experience. We additionally collect basic usage data about how you interact
        with the extension to maintain and improve the service.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">How We Use Your Information</h2>
      <p>
        We use your information to authenticate you and provide access to the extension&apos;s
        features, personalize email suggestions based on your profile information, store your sent
        email history for your reference, save your custom email templates, and generate
        personalized email content using AI services. We also use this information to improve the
        extension&apos;s functionality and overall user experience.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Data Storage</h2>
      <p>
        Your profile information, custom templates, and email history are stored locally in your
        browser using Chrome&apos;s storage API, and this information is associated with your Google
        email address. When generating email content, LinkedIn profile data may be temporarily
        processed by our server which utilizes AI services; we do not permanently store LinkedIn
        profile data or generated email content on our servers.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Data Sharing</h2>
      <p>
        We do not sell, trade, or rent your personal information to third parties. We may share
        information with third-party service providers, such as AI providers, to help operate the
        extension. These providers may only access your information to perform tasks on our behalf
        and are obligated not to disclose or use it for other purposes. We may also disclose
        information when required to do so by law or in response to valid requests by public
        authorities.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Google API Services</h2>
      <p>
        Our extension uses Google API Services. By using our extension, you acknowledge and
        agree that we access and use data from Google APIs in accordance with Google&apos;s API
        Services User Data Policy. The use of information received from Google APIs will
        adhere to the Google API Services User Data Policy, including the Limited Use
        requirements.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">AI/ML Usage</h2>
      <p>
        We do not use Google Workspace APIs to develop, improve, or train generalized AI and/or
        ML models. Our application strictly adheres to the Google API Services User Data Policy,
        ensuring that any data accessed through Google APIs is used solely for the intended
        purposes and not for generalized AI/ML model training.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Your Choices</h2>
      <p>
        You can log out of the extension at any time to prevent further collection of
        information, edit or update your profile information, and delete your email history and
        templates through your browser&apos;s extension settings.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Security</h2>
      <p>
        We implement appropriate security measures to protect against unauthorized access,
        alteration, disclosure, or destruction of your personal information. However, no method
        of transmission over the Internet or electronic storage is 100% secure.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Changes to This Privacy Policy</h2>
      <p>
        We may update our Privacy Policy from time to time. We will notify you of any changes by
        posting the new Privacy Policy on this page and updating the &quot;Last Updated&quot; date.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Contact Us</h2>
      <p>
        If you have any questions about this Privacy Policy, please contact us at:
        <br />
        <span className="font-medium">ishaan4g@gmail.com</span>
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">California Privacy Rights</h2>
      <p>
        If you are a California resident, you have specific rights regarding your personal
        information under the California Consumer Privacy Act (CCPA). This includes the right to
        request disclosure of personal information we collect and share about you, and the right
        to request deletion of your personal information.
      </p>

      <h2 className="my-8 text-primary font-tiempos-medium text-xl">Children&apos;s Privacy</h2>
      <p className="mb-36">
        Our extension is not intended for children under 13 years of age. We do not knowingly
        collect personal information from children under 13.
      </p>

    </main>
  );
}


