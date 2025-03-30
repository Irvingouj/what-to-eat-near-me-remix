import { useState } from 'react';

interface FilterModalProps {
	filters: {
		excludeFastFood: boolean;
		vegetarianOnly: boolean;
		noPork: boolean;
		cheapOnly: boolean;
	};
	onClose: () => void;
	onApply: (filters: FilterModalProps['filters']) => void;
}

export function FilterModal({ filters, onClose, onApply }: FilterModalProps) {
	const [localFilters, setLocalFilters] = useState(filters);

	const handleChange = (key: keyof typeof filters) => {
		setLocalFilters(prev => ({
			...prev,
			[key]: !prev[key]
		}));
	};

	const handleApply = () => {
		onApply(localFilters);
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full animate-fade-in">
				<div className="flex justify-between items-center mb-6">
					<h3 className="text-xl font-bold text-gray-800">
						What do you want to see more or less of?
					</h3>
					<button
						type="button"
						onClick={onClose}
						className="text-gray-500 hover:text-gray-700"
						title="Close filter modal"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
							aria-label="Close filter modal"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth={2}
								d="M6 18L18 6M6 6l12 12"
							/>
						</svg>
					</button>
				</div>

				<div className="space-y-4 mb-6">
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 text-red-600"
							checked={localFilters.excludeFastFood}
							onChange={() => handleChange('excludeFastFood')}
						/>
						<span className="ml-2 text-gray-700">Exclude Fast Food</span>
					</label>
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 text-red-600"
							checked={localFilters.vegetarianOnly}
							onChange={() => handleChange('vegetarianOnly')}
						/>
						<span className="ml-2 text-gray-700">Only Vegetarian Options</span>
					</label>
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 text-red-600"
							checked={localFilters.noPork}
							onChange={() => handleChange('noPork')}
						/>
						<span className="ml-2 text-gray-700">No Pork</span>
					</label>
					<label className="flex items-center cursor-pointer">
						<input
							type="checkbox"
							className="form-checkbox h-5 w-5 text-red-600"
							checked={localFilters.cheapOnly}
							onChange={() => handleChange('cheapOnly')}
						/>
						<span className="ml-2 text-gray-700">Cheap Only (&lt;$)</span>
					</label>
				</div>

				<button
					type="button"
					onClick={handleApply}
					className="w-full bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition"
				>
					Apply Filters
				</button>
			</div>
		</div>
	);
}
