export default function Home() {
  return (
    <div className="bg-background text-on-background font-body selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Navigation Bar */}
      <nav className="bg-[#F9F8F4]/80 backdrop-blur-[20px] fixed top-0 w-full z-50 border-b-2 border-outline-variant/30">
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="flex items-center text-xl font-heading font-bold tracking-tighter text-primary">
            <img src="/logo.png" alt="" className="h-6 w-auto" />TASHY
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a className="text-primary border-b-2 border-primary pb-1 font-heading text-sm font-bold uppercase tracking-tight" href="#">Docs</a>
            <a className="text-on-surface hover:text-primary transition-colors font-heading text-sm font-bold uppercase tracking-tight" href="#">Community</a>
            <a className="text-on-surface hover:text-primary transition-colors font-heading text-sm font-bold uppercase tracking-tight" href="#">Pricing</a>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-on-surface font-label font-bold uppercase text-[0.6875rem] px-4 py-2 transition-transform active:scale-95">Sign In</button>
            <button className="bg-primary text-white font-label font-bold uppercase text-[0.6875rem] px-6 py-3 tactile-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all active:scale-95">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="pt-40 pb-24 px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6">
            <h1 className="font-heading text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Your Digital <br />
              <span className="text-primary">Architect&apos;s Studio.</span>
            </h1>
            <p className="text-on-surface-variant text-xl md:text-2xl mb-10 leading-relaxed max-w-xl">
              The tactile note and snippet manager for anyone who craves order, speed, and precision.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-primary text-white font-label font-bold uppercase text-[0.75rem] px-8 py-4 tactile-shadow hover:translate-x-[-1px] hover:translate-y-[-1px] transition-all active:scale-95">
                Start Organizing for Free
              </button>
              <button className="border-2 border-outline text-on-surface font-label font-bold uppercase text-[0.75rem] px-8 py-4 transition-all active:scale-95 flex items-center justify-center gap-2 hover:bg-surface-container">
                <span className="material-symbols-outlined text-sm">play_circle</span>
                Watch Demo
              </button>
            </div>
          </div>
          <div className="lg:col-span-6 relative">
            <div className="bg-surface architect-border p-4 tactile-shadow rounded-xl transform lg:rotate-2">
              <div className="bg-on-surface rounded-lg p-6 font-mono text-sm leading-6 architect-border">
                <div className="flex items-center gap-2 mb-6 border-b-2 border-surface-container-highest/20 pb-4">
                  <span className="w-3 h-3 rounded-full bg-primary"></span>
                  <span className="w-3 h-3 rounded-full bg-[#59DDAA]"></span>
                  <span className="w-3 h-3 rounded-full bg-[#FFDAD8]"></span>
                  <span className="ml-4 text-surface-container-high font-body">snippet.tsx</span>
                </div>
                <pre className="text-white"><span className="text-primary">const</span> <span className="text-[#59DDAA]">studio</span> = () =&gt; {"{"}{"\n"}  <span className="text-primary">return</span> ({"\n"}    &lt;<span className="text-primary">Workspace</span>&gt;{"\n"}      &lt;<span className="text-primary">Architect</span> mode=&quot;tactile&quot; /&gt;{"\n"}      <span className="text-outline-variant/50">{"// Precision matters"}</span>{"\n"}      &lt;<span className="text-primary">Grid</span> spacing={"{24}"} /&gt;{"\n"}    &lt;/<span className="text-primary">Workspace</span>&gt;{"\n"}  );{"\n"}{"}"};
                </pre>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-6 -left-6 bg-primary p-4 tactile-shadow hidden sm:block border-2 border-outline">
              <span className="font-heading font-bold text-xs uppercase text-white">Tactile Interface Enabled</span>
            </div>
          </div>
        </div>
      </header>

      {/* Social Proof */}
      <section className="py-12 bg-surface-container-low border-y-2 border-outline/10">
        <div className="max-w-7xl mx-auto px-8">
          <p className="font-label font-bold uppercase text-[0.6875rem] text-on-surface-variant text-center mb-8 tracking-widest">Trusted by 50,000+ Creative Professionals</p>
          <div className="flex flex-wrap justify-center items-center gap-12 md:gap-24 opacity-70 grayscale">
            <div className="text-2xl font-heading font-bold">PRISMA</div>
            <div className="text-2xl font-heading font-bold">VERCEL</div>
            <div className="text-2xl font-heading font-bold">STRIPE</div>
            <div className="text-2xl font-heading font-bold">LINEAR</div>
            <div className="text-2xl font-heading font-bold">GITHUB</div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="py-32 px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-4xl font-bold mb-16 border-l-4 border-primary pl-6">Core Infrastructure</h2>
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            {/* Large Feature */}
            <div className="md:col-span-8 bg-surface architect-border p-10 tactile-shadow group hover:bg-surface-container-low transition-colors">
              <div className="mb-8">
                <span className="material-symbols-outlined text-primary text-4xl">markdown</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Markdown First</h3>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-6">Distraction-free writing with live preview. Built for those who think in structured text and love clarity.</p>
              <div className="bg-surface-container p-4 architect-border border-dashed">
                <div className="h-2 w-3/4 bg-outline-variant mb-2"></div>
                <div className="h-2 w-1/2 bg-outline-variant mb-2"></div>
                <div className="h-2 w-2/3 bg-outline-variant"></div>
              </div>
            </div>
            {/* Small Feature */}
            <div className="md:col-span-4 bg-surface architect-border p-10 tactile-shadow hover:translate-y-[-4px] transition-transform">
              <div className="mb-8">
                <span className="material-symbols-outlined text-tertiary text-4xl">sell</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Smart Taxonomy</h3>
              <p className="text-on-surface-variant leading-relaxed">Powerful tagging system to categorize notes, snippets, and ideas. Organize like a librarian.</p>
            </div>
            {/* Small Feature */}
            <div className="md:col-span-4 bg-surface architect-border p-10 tactile-shadow hover:translate-y-[-4px] transition-transform">
              <div className="mb-8">
                <span className="material-symbols-outlined text-primary text-4xl">search</span>
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4">Omni-Search</h3>
              <p className="text-on-surface-variant leading-relaxed">Find any note or snippet instantly with Cmd+K. Lightning fast indexing for your entire studio.</p>
            </div>
            {/* Large Feature */}
            <div className="md:col-span-8 bg-surface architect-border p-10 tactile-shadow relative overflow-hidden group">
              <div className="z-10 relative">
                <div className="mb-8">
                  <span className="material-symbols-outlined text-primary text-4xl">grid_view</span>
                </div>
                <h3 className="font-heading text-2xl font-bold mb-4">Tactile Interface</h3>
                <p className="text-on-surface-variant text-lg leading-relaxed mb-6">A physical feel with 2px architectural borders and solid offset shadows. UI that feels like solid hardware.</p>
              </div>
              <div className="absolute right-[-10%] bottom-[-20%] opacity-10 group-hover:opacity-20 transition-opacity">
                <span className="material-symbols-outlined text-[200px]">architecture</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 px-8 bg-surface-container">
        <div className="max-w-4xl mx-auto text-center bg-surface architect-border p-16 tactile-shadow relative">
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-primary px-4 py-1 text-white font-label font-bold uppercase text-[0.6875rem]">Final Call</div>
          <h2 className="font-heading text-4xl md:text-5xl font-bold mb-6">Ready to clear your desk?</h2>
          <p className="text-on-surface-variant text-xl mb-10 max-w-lg mx-auto">Join thousands of creators building their digital legacy with TASHY.</p>
          <button className="bg-primary text-white font-label font-bold uppercase text-[0.875rem] px-12 py-5 tactile-shadow hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all active:scale-95">
            Join the Studio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-highest border-t-2 border-outline/10">
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 py-12 gap-6">
          <div className="flex flex-col items-center md:items-start gap-4">
            <div className="text-lg font-bold text-primary">TASHY</div>
            <p className="font-body text-sm text-on-surface-variant">&copy; 2024 TASHY. Built for the Creative Mind.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8">
            <a className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-body text-sm transition-opacity opacity-80 hover:opacity-100" href="#">Privacy Policy</a>
            <a className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-body text-sm transition-opacity opacity-80 hover:opacity-100" href="#">Terms of Service</a>
            <a className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-body text-sm transition-opacity opacity-80 hover:opacity-100" href="#">Github</a>
            <a className="text-on-surface-variant hover:text-primary underline underline-offset-4 font-body text-sm transition-opacity opacity-80 hover:opacity-100" href="#">Discord</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
