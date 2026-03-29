import { Accordion } from '@heroui/react';
import {
  ShoppingCart,
  UtensilsCrossed,
  UserCircle,
  Smartphone,
  MessageCircle,
  Phone,
  HelpCircle,
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
}
interface FAQGroup {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  bgColor: string;
  items: FAQItem[];
}

const FAQ_GROUPS: FAQGroup[] = [
  {
    id: 'ordering',
    label: 'Ordering',
    icon: ShoppingCart,
    color: 'text-orange-600 dark:text-orange-400',
    bgColor: 'bg-orange-50 dark:bg-orange-950/30',
    items: [
      {
        id: 'o1',
        question: 'How do I place an order?',
        answer:
          'Browse the menu on the home screen, click any burger to customise it (size, extras, toppings), then add it to your bag. Open the cart, select a pickup location, and press "Place Order".',
      },
      {
        id: 'o2',
        question: 'Can I customise my burger?',
        answer:
          'Yes! Tap any burger card to open the customise modal. You can choose toppings, sauces, and extras. The live price updates as you select items.',
      },
      {
        id: 'o3',
        question: 'How do I change or cancel my order?',
        answer:
          'Orders can be modified in the cart before placing them. Once placed, please call your chosen pickup location directly to request changes.',
      },
      {
        id: 'o4',
        question: 'Is there a minimum order value?',
        answer:
          'There is no minimum order. You can order a single item and pick it up at any of our locations.',
      },
    ],
  },
  {
    id: 'menu',
    label: 'Menu & Ingredients',
    icon: UtensilsCrossed,
    color: 'text-green-700 dark:text-green-400',
    bgColor: 'bg-green-50 dark:bg-green-950/30',
    items: [
      {
        id: 'm1',
        question: 'Are there vegetarian or vegan options?',
        answer:
          'Absolutely. Look for the Veggie category — it includes our plant-based patties and black bean burgers. The Plant-Based Stack uses vegan cheese and herb aioli.',
      },
      {
        id: 'm2',
        question: 'Do you list allergen information?',
        answer:
          'Each burger description lists its main ingredients. For full allergen data, please contact your nearest location directly.',
      },
      {
        id: 'm3',
        question: 'Are the ingredient images accurate?',
        answer:
          'Images are representative. Actual presentation may vary slightly by location and batch. We always strive to match the photos as closely as possible.',
      },
    ],
  },
  {
    id: 'account',
    label: 'Account & Loyalty',
    icon: UserCircle,
    color: 'text-purple-600 dark:text-purple-400',
    bgColor: 'bg-purple-50 dark:bg-purple-950/30',
    items: [
      {
        id: 'a1',
        question: 'How do loyalty points work?',
        answer:
          'You earn points on every order. Accumulate enough points to advance through tiers: Bronze → Silver → Gold → Platinum. Higher tiers unlock exclusive perks.',
      },
      {
        id: 'a2',
        question: 'Who owns the application?',
        answer:
          'The Grid is owned and operated by Oltion Zefi. The application is provided as-is for demonstration purposes.',
      },
      {
        id: 'a3',
        question: 'Is the application available 24/7?',
        answer:
          "The app is available around the clock. Actual pickup availability depends on each location's opening hours.",
      },
    ],
  },
  {
    id: 'app',
    label: 'App & Technical',
    icon: Smartphone,
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-50 dark:bg-blue-950/30',
    items: [
      {
        id: 't1',
        question: 'Why does the map ask for my location?',
        answer:
          'The map can centre on your position to help you find the nearest pickup location. You can also deny location access and search by address instead.',
      },
      {
        id: 't2',
        question: 'Can I add my own pickup locations?',
        answer:
          'Yes. Go to Settings → Shop Locations, tap "Add", enter a name and address, and the app will geocode it automatically.',
      },
      {
        id: 't3',
        question: 'How do I change the app theme?',
        answer:
          'Open Settings → Appearance and choose Light, Dark, or System (follows your OS preference).',
      },
    ],
  },
];

function FAQ() {
  const totalQuestions = FAQ_GROUPS.reduce((n, g) => n + g.items.length, 0);

  return (
    <div className="flex flex-col flex-1">
      {/* Page header */}
      <div className="border-b border-border bg-surface-secondary/40 shrink-0">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Help &amp; FAQ</h1>
            <p className="text-sm text-muted mt-0.5">
              {totalQuestions} questions across{FAQ_GROUPS.length} categories
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {FAQ_GROUPS.map((g) => (
              <a
                key={g.id}
                href={`#faq-${g.id}`}
                className={[
                  'inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg border border-border hover:bg-surface-secondary transition-colors',
                  g.color,
                ].join(' ')}
              >
                <g.icon size={12} />
                <span className="hidden md:inline">{g.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-6 py-6">
          {/* 2-column grid — 2 groups per column, flow naturally */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
            {FAQ_GROUPS.map((group) => (
              <section key={group.id} id={`faq-${group.id}`} className="flex flex-col gap-3">
                <div
                  className={[
                    'inline-flex items-center gap-2.5 px-3 py-2 rounded-xl self-start',
                    group.bgColor,
                  ].join(' ')}
                >
                  <group.icon size={15} className={group.color} />
                  <h2 className={['font-semibold text-sm', group.color].join(' ')}>
                    {group.label}
                  </h2>
                  <span className={['text-xs font-bold opacity-60', group.color].join(' ')}>
                    {group.items.length}
                  </span>
                </div>

                <Accordion className="rounded-2xl border border-border overflow-hidden">
                  {group.items.map(({ id, question, answer }) => (
                    <Accordion.Item key={id} id={id}>
                      <Accordion.Trigger className="px-5 py-4 text-sm font-medium text-left hover:bg-surface-secondary transition-colors w-full">
                        {question}
                      </Accordion.Trigger>
                      <Accordion.Panel className="px-5 pb-4 pt-1 text-sm text-muted leading-relaxed">
                        {answer}
                      </Accordion.Panel>
                    </Accordion.Item>
                  ))}
                </Accordion>
              </section>
            ))}
          </div>

          {/* Contact card — full width */}
          <div className="mt-6 rounded-2xl border border-border bg-surface-secondary p-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center shrink-0">
                  <HelpCircle size={18} className="text-[var(--accent)]" />
                </div>
                <div>
                  <h2 className="font-semibold text-sm">Still need help?</h2>
                  <p className="text-sm text-muted mt-0.5">
                    Can't find what you're looking for? Reach out directly.
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 shrink-0">
                <a
                  href="mailto:support@thegrid.com"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-border bg-overlay hover:bg-border transition-colors"
                >
                  <MessageCircle size={14} />
                  support@thegrid.com
                </a>
                <a
                  href="tel:+4989000000"
                  className="inline-flex items-center gap-1.5 text-sm font-medium px-4 py-2 rounded-xl border border-border bg-overlay hover:bg-border transition-colors"
                >
                  <Phone size={14} />
                  +49 89 000 000
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FAQ;
