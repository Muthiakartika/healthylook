import Container from "@/components/ui/Container";
import {
  InstagramIcon,
  FacebookIcon,
  WhatsAppIcon,
  MapPinIcon,
  PhoneIcon,
} from "@/components/ui/icons";
import {
  SOCIAL_LINKS,
  ADDRESS,
  PHONE_DISPLAY,
  PHONE_E164,
  MAPS_HREF,
} from "@/lib/constants";

/**
 * The slim strip above the navigation, over the hero only.
 *
 * It carries the two things a walk-in clinic is actually asked for — where
 * it is and what its number is — plus the socials, which is where a lot of
 * this clinic's audience finds it first. All of it already existed on the
 * site, buried in the footer; this puts it in the first viewport, which is
 * where the live site's own header keeps its phone number too.
 *
 * Desktop only. On a phone this would either wrap to two lines or truncate
 * the address to nonsense, and the same details are one tap away in the
 * mobile drawer and the StickyCTA.
 */
const socialIcons = {
  instagram: InstagramIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsAppIcon,
};

export default function TopBar() {
  return (
    <div className="hidden border-b border-white/10 lg:block">
      <Container className="flex h-11 items-center justify-between gap-8">
        <div className="flex items-center gap-1">
          {SOCIAL_LINKS.map((social) => {
            const Icon = socialIcons[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="rounded-edge p-1.5 text-white/60 transition-colors duration-300 hover:text-accent"
              >
                <Icon className="h-3.5 w-3.5" />
              </a>
            );
          })}
        </div>

        <div className="flex items-center gap-7">
          <a
            href={MAPS_HREF}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-2 font-sans text-caption text-white/60 transition-colors duration-300 hover:text-white"
          >
            <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
            {ADDRESS}
          </a>
          <a
            href={`tel:${PHONE_E164}`}
            className="flex items-center gap-2 font-sans text-caption text-white/60 transition-colors duration-300 hover:text-white"
          >
            <PhoneIcon className="h-3.5 w-3.5 shrink-0 text-accent" />
            {PHONE_DISPLAY}
          </a>
        </div>
      </Container>
    </div>
  );
}
