import React from "react";

const PrivacyPolicy = () => {
  return (
    <div className="bg-white min-h-screen py-16 px-4">
      <div className="max-w-3xl mx-auto text-gray-800 leading-relaxed">
        <h1 className="text-4xl font-bold text-center mb-12 text-black">
          I Done This – Privacy Policy
        </h1>

        <div className="space-y-8">
          <section>
            <h2 className="font-bold text-black uppercase mb-4">
              PRIVACY POLICY
            </h2>
            <p className="mb-4">
              I Done This (“we”, “us”, “our”) are committed to protecting and
              respecting your privacy.
            </p>
            <p className="mb-4">
              This privacy policy (“Privacy Policy”) together with our{" "}
              <a href="#" className="text-orange-600 underline">
                Terms and Conditions of Service
              </a>{" "}
              and any other documents referred to therein, sets out the basis on
              which any personal data we collect from you, or that you provide
              to us, will be processed by us. Please read the following
              carefully to understand our views and practices regarding your
              personal data and how we will treat it. By visiting{" "}
              <a
                href="https://idonethis.com"
                className="text-orange-600 underline"
              >
                https://idonethis.com
              </a>
              , (“Site”) you are accepting and consenting to the practices
              described in this Privacy Policy.
            </p>
            <p>
              For the purpose of the Data Protection Act 1998 or any subsequent
              amendment or replacement or supplementary legislation (the “Act”),
              the data controller is I Done This.
            </p>
            <p className="mt-4">
              If you have any questions or comments, or if you want to update,
              delete, or change any Personal Information we hold, or you have a
              concern about the way in which we have handled any privacy matter,
              please contact us by email at:{" "}
              <a
                href="mailto:support@idonethis.com"
                className="text-orange-600 underline"
              >
                support@idonethis.com
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-bold text-black uppercase mb-4">
              INFORMATION WE MAY COLLECT FROM YOU
            </h2>
            <p className="mb-4 text-sm font-semibold">
              We may collect and process the following data about you:
            </p>
            <ul className="list-none space-y-4">
              <li>
                <strong>Information you give us.</strong> You may give us
                information about you by filling in forms on our Site or by
                corresponding with us by phone, e-mail or otherwise...
              </li>
              <li>
                <strong>Information we collect about you.</strong> With regard
                to each of your visits to our Site we may automatically collect
                technical information, URL clickstreams, and interaction data...
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-bold text-black uppercase mb-4">COOKIES</h2>
            <p>
              We use cookies on our Site to distinguish you from other users of
              our Site. This helps us to provide you with a good experience when
              you browse our Site and also allows us to improve the Site.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-black uppercase mb-4">
              PROTECTION OF INFORMATION
            </h2>
            <p>
              All information you provide to us is stored on secure servers. Any
              payment transactions will be encrypted using SSL technology. Where
              we have given you a password, you are responsible for keeping this
              password confidential.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-black uppercase mb-4">
              DATA RETENTION
            </h2>
            <p>
              We retain personal data for as long as necessary for the relevant
              activity for which it was provided or collected. After you have
              closed your account, we usually delete personal data after 12
              months.
            </p>
          </section>

          <section>
            <h2 className="font-bold text-black uppercase mb-4">COMPLAINTS</h2>
            <p>
              If you have any complaints about our use of your personal data
              please contact us at{" "}
              <a
                href="mailto:help@idonethis.com"
                className="text-orange-600 underline"
              >
                help@idonethis.com
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
