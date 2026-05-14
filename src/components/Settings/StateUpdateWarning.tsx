// src\components\Settings\StateUpdateWarning.tsx
'use client'

import { AlertTriangle, Calendar } from 'lucide-react'
import { useGetProfileWithEligibilityQuery } from '@/redux/api/authApi'

export function StateUpdateWarning() {
  const { data: eligibilityData } = useGetProfileWithEligibilityQuery(undefined)

  const eligibility = eligibilityData?.data?.stateUpdateEligibility

  if (!eligibility || eligibility.canChange) {
    return null
  }

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
        <div>
          <h4 className="text-sm font-semibold text-yellow-800">
            State Change Restricted
          </h4>
          <p className="text-sm text-yellow-700 mt-1">
            Primary state can only be changed once every 30 days.
          </p>
          <div className="flex items-center gap-2 mt-2 text-xs text-yellow-700">
            <Calendar className="h-3 w-3" />
            <span>
              You last changed it {eligibility.daysSinceLastUpdate} days ago.
              {eligibility.daysRemaining > 0 &&
                ` Please wait ${eligibility.daysRemaining} more days.`}
            </span>
          </div>
          {eligibility.nextAvailableDate && (
            <p className="text-xs text-yellow-600 mt-1">
              Next available date:{' '}
              {new Date(eligibility.nextAvailableDate).toLocaleDateString()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
