import { Link } from 'react-router';
import BiliCalculator from '@/components/BiliCalculator';
import { PageHeader } from '@/components/ui';

export default function CalculatorPage() {
  return (
    <div>
      <PageHeader
        title="Bilirubin calculator"
        lead={
          <>
            AAP 2022 thresholds, escalation, follow-up, rate of rise and B/A ratio in one view. Add serial values to see the trajectory. Teaching behind every rule:{' '}
            <Link to="/thresholds" className="font-semibold text-brand-strong hover:underline">
              Module 4
            </Link>
            .
          </>
        }
      />
      <BiliCalculator />
    </div>
  );
}
