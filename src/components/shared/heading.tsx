type TheadingProps = {
  title: string;
  description?: string;
  className?: string;
};

export default function Heading({
  title,
  description,
  className,
}: TheadingProps) {
  return (
    <div className={className}>
      <h1 className="text-xl font-bold tracking-tight text-primary sm:text-3xl">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}
