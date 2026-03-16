import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export default async function MyReviewsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: reviews } = await supabase
    .from('api_reviews')
    .select('*, api:apis(name, slug)')
    .eq('user_id', user?.id)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-7xl mx-auto px-4 pt-32 pb-24">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <h1 className="text-4xl font-bold font-syne mb-2">My <span className="text-[#22d3ee]">Reviews</span></h1>
          <p className="text-gray-500">Share your API experiences with the community.</p>
        </div>
        
        <div className="flex bg-white/5 border border-white/10 p-1 rounded-lg">
           <Link href="/dashboard" className="px-6 py-2 hover:bg-white/5 rounded-md text-sm transition">Saved APIs</Link>
           <Link href="/dashboard/vault" className="px-6 py-2 hover:bg-white/5 rounded-md text-sm transition">Key Vault</Link>
           <Link href="/dashboard/reviews" className="px-6 py-2 bg-white/10 rounded-md text-sm font-bold">My Reviews</Link>
        </div>
      </div>

      <div className="space-y-6 max-w-4xl">
        {reviews?.map((r: any) => (
          <div key={r.id} className="p-8 border border-white/10 rounded-2xl bg-white/[0.02]">
             <div className="flex justify-between items-start mb-4">
                <Link href={`/api/${r.api.slug}`} className="text-[#22d3ee] font-bold hover:underline">
                   {r.api.name}
                </Link>
                <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
             </div>
             <div className="text-[#22d3ee] font-mono text-[10px] uppercase tracking-widest mb-4">Rating: {r.rating}/5</div>
             <h4 className="font-bold mb-2">{r.title}</h4>
             <p className="text-sm text-gray-400 leading-relaxed mb-6">{r.body}</p>
             <div className="flex space-x-4">
                <button className="text-[10px] uppercase tracking-widest text-gray-500 hover:text-white transition">Edit</button>
                <button className="text-[10px] uppercase tracking-widest text-red-500/70 hover:text-red-500 transition">Delete</button>
             </div>
          </div>
        ))}

        {(!reviews || reviews.length === 0) && (
           <div className="py-24 text-center border border-dashed border-white/10 rounded-2xl italic text-gray-500">
              You haven't written any reviews yet.
           </div>
        )}
      </div>
    </div>
  );
}
