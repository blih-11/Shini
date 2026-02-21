export default function About() {
  const values = [
    { icon: '✦', title: 'Bold by Design', desc: 'Every piece is crafted with intention. We believe clothing should be a statement — a visual language that speaks before you do.' },
    { icon: '◈', title: 'Quality First', desc: 'We source only premium fabrics and work with skilled artisans who share our obsession with craft and longevity.' },
    { icon: '❋', title: 'Sustainably Minded', desc: "From ethical sourcing to eco-conscious packaging, we're building a brand that considers its impact every step of the way." },
    { icon: '◇', title: 'Inclusive Style', desc: 'SHiNi is for everyone who dares to express themselves. Our sizing and silhouettes are designed for real bodies, real lives.' },
  ];

  const team = [
    { name: 'Adaeze Okonkwo', role: 'Founder & Creative Director', img: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Emeka Nwachukwu', role: 'Head of Design', img: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400' },
    { name: 'Zara Musa', role: 'Brand Director', img: 'https://images.pexels.com/photos/1542085/pexels-photo-1542085.jpeg?auto=compress&cs=tinysrgb&w=400' },
  ];

  return (
    <div className="bg-brand-bg min-h-screen">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[320px] overflow-hidden">
        <img src="https://images.pexels.com/photos/1598507/pexels-photo-1598507.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="About SHiNi" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-brand-bg/78" />
        <div className="absolute inset-0 flex items-center justify-center text-center px-4">
          <div>
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">Our Story</span>
            <h1 className="text-brand-cream text-5xl md:text-6xl font-black mt-3">
              About SHi<span className="text-brand-accent">Ni</span>
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        {/* Story */}
        <div className="grid md:grid-cols-2 gap-10 md:gap-16 items-center mb-20">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-6 h-0.5 bg-brand-accent" />
              <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">How It Began</span>
            </div>
            <h2 className="text-brand-cream text-3xl font-bold leading-tight mb-5">Born in Lagos.<br />Made for the World.</h2>
            <div className="space-y-4 text-brand-muted text-sm leading-relaxed">
              <p>SHiNi was founded in 2019 by Adaeze Okonkwo, a Lagos-born designer with a vision to create a premium African clothing brand that speaks to the modern global wardrobe.</p>
              <p>The name "SHiNi" is a declaration — a bold invitation for every person who wears our clothing to let their light shine unapologetically.</p>
              <p>From our first collection of five pieces to our current range of over 100 styles, SHiNi has grown into a brand that bridges African craftsmanship with contemporary global design.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl overflow-hidden aspect-[3/4]">
              <img src="https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=500" alt="" className="w-full h-full object-cover" />
            </div>
            <div className="rounded-xl overflow-hidden aspect-[3/4] mt-8">
              <img src="https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=500" alt="" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20 p-8 md:p-12 bg-brand-accent rounded-2xl">
          {[['2019', 'Founded'], ['50+', 'Collections'], ['10,000+', 'Happy Clients'], ['3', 'Store Locations']].map(([num, label]) => (
            <div key={label} className="text-center">
              <div className="text-white font-black text-3xl md:text-4xl">{num}</div>
              <div className="text-white/70 text-sm mt-1">{label}</div>
            </div>
          ))}
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">What We Stand For</span>
            <h2 className="text-brand-cream text-3xl font-bold mt-2">Our Values</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map(v => (
              <div key={v.title} className="bg-white/4 border border-white/8 rounded-2xl p-6 hover:border-brand-accent/35 transition-colors duration-200">
                <div className="text-brand-accent text-2xl mb-4">{v.icon}</div>
                <h3 className="text-brand-cream font-bold text-base mb-2">{v.title}</h3>
                <p className="text-brand-muted text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div>
          <div className="text-center mb-10">
            <span className="text-brand-accent text-xs font-semibold uppercase tracking-widest">The Minds Behind SHiNi</span>
            <h2 className="text-brand-cream text-3xl font-bold mt-2">Meet the Team</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map(member => (
              <div key={member.name} className="text-center group">
                <div className="w-36 h-36 mx-auto rounded-full overflow-hidden mb-4 border-2 border-white/10 group-hover:border-brand-accent transition-colors duration-200">
                  <img src={member.img} alt={member.name} className="w-full h-full object-cover" />
                </div>
                <h3 className="text-brand-cream font-bold text-base">{member.name}</h3>
                <p className="text-brand-muted text-sm mt-1">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
