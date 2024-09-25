import { socialMedia } from '@/data/data';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: 'Contact Us',
    description: 'Contact Us',
  };
}

export default function ContactPage() {
  return (
    <section className="grid gap-4 p-8 mb-20 max-w-screen-xl mx-auto items-center">
      <h2 className="font-bold text-4xl py-8"> Information Contact </h2>
      <div className="grid md:grid-cols-2 sm:grid-cols-1 gap-8">
        <div className="p-8 rounded-lg">
          <h3 className="font-bold text-2xl">Contact Us</h3>
          <p className="mt-4">
            If you have any questions or concerns, please feel free to reach out
            to us. We will get back to you as soon as possible.
          </p>
          <div className="mt-4">
            <ul className="flex gap-2">
              {socialMedia.map(
                (item: { link: string; icon: JSX.Element }, index: number) => (
                  <li key={index}>
                    <Link href={item.link} className="nav-link">
                      {item.icon}
                    </Link>
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
        <div className="p-8">
          <h3 className="font-bold text-2xl mb-4">Address</h3>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1177.6240823512226!2d107.61422510734094!3d-6.885874924235896!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e68e6f8c724a62b%3A0x8392980209ac3a04!2sJl.%20Dipati%20Ukur%2C%20Lebakgede%2C%20Kecamatan%20Coblong%2C%20Kota%20Bandung%2C%20Jawa%20Barat%2040132!5e0!3m2!1sid!2sid!4v1718347386028!5m2!1sid!2sid"
            width={'100%'}
            height="250"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </section>
  );
}
